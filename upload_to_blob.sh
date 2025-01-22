#!/bin/bash

set -e

# Variables
DIRNAME="report_$(date +%Y%m%d%H%M%S)"
SOURCE_DIR="/app/cypress/reports"

# Ensure SOURCE_DIR exists
if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: Source directory $SOURCE_DIR does not exist." >&2
  exit 1
fi

# Function to sanitize file names
remove_whitespace_etc() {
  local FILE_NAME="$1"
  local NAME="${FILE_NAME%.*}"
  local EXT="${FILE_NAME##*.}"
  NAME=$(echo "$NAME" | sed -E 's/[[:space:][:punct:]]+/_/g')
  # Remove any trailing underscore
  NAME=$(echo "$NAME" | sed 's/_$//')
  echo "${NAME}.${EXT}"
}

# Loop through files and upload
find "$SOURCE_DIR" -type f -print0 | while IFS= read -r -d '' FILE; do
  FILE_NAME=$(basename "$FILE")
  FILE_TO_UPLOAD=$(remove_whitespace_etc "$FILE_NAME")
  
  # Get the relative path of the file (relative to SOURCE_DIR)
  RELATIVE_PATH="${FILE#$SOURCE_DIR/}"
  
  # Now we want to strip off directories, keeping only the relative part that matches the file name
  RELATIVE_PATH_DIR=$(dirname "$RELATIVE_PATH") # The directory part (e.g., test.feature)

  # Ensure SAS_TOKEN is set
  if [[ -z "$SAS_TOKEN" ]]; then
    echo "Error: SAS_TOKEN is not set." >&2
    exit 1
  fi

  # Construct the full blob URL with only the sanitized file name
  BLOB_URL="/$DIRNAME/$RELATIVE_PATH_DIR/$FILE_TO_UPLOAD?$SAS_TOKEN"

  echo "Uploading $FILE to $BLOB_URL"
  curl -H "x-ms-blob-type: BlockBlob" --upload-file "$FILE" --url "$BLOB_URL" || {
    echo "Error uploading $FILE to $BLOB_URL" >&2
    exit 1
  }
done

echo "All files uploaded successfully!"
