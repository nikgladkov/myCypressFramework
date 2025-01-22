const { defineConfig } = require("cypress");
const cypressOnFix = require("cypress-on-fix");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.webdriveruniversity.com/",
    specPattern: "**/*.feature",
    setupNodeEvents,
  },
});

async function setupNodeEvents(on, config) {
  on = cypressOnFix(on);

  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  return config;
}
