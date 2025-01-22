Hi!

I am working as QA and, currently, I am in the process of developing autotests for my work project.

I gained knowledge from the Udemy course [Cypress with Cucumber BDD - Automation Testing Bootcamp](https://www.udemy.com/course/cypress-with-cucumber-bdd-beginner-to-expert-in-9-hours/?couponCode=KEEPLEARNING) and I want to share my approach to setting up a Cypress project. There are some details I found missing in other guides, and I want to cover them. 

The Cypress framework git repository - [link](https://github.com/nikgladkov/myCypresFramework).

I would be glad to get your feedback to improve my project! You can [reach me on LinkedIn](https://www.linkedin.com/in/nik-gladkov-qa/?locale=en_US).

Happy testing, everyone! :)

# Goals

My goal as a tester is to realize the following process for my work project:

Tests Preparing → Tests Implementation → Test Execution → Reporting

# Features to test

I prepare tests as sets of manual tests in a separate Qase repository. The test cases marked as "To be automated" are later implemented in Cypress using my framework.

In this repository, [Demo_Test.feature](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress/e2e/Demo_Test.feature) is shown as a demo considering my approach to arrangement of the real project.

The test simply goes to the base Url set in the e2e section of the [cypress.config.js](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress.config.js). After it fills the Contact form, submit and check the resulting page.

Feature file has a link to related test in the Qase and related tags - tags are used for running tests with [scripts](#scripting).

# Platform and Packages

For tests implementation I use the TypeScript + Cucumber platform and is based on the [esbuild-ts example from badeball/cypress-cucumber-preprocessor package repo](https://github.com/badeball/cypress-cucumber-preprocessor/tree/master/examples/esbuild-ts) with additions that I found to be a good fit for my purposes.

For details please see the package docs - https://github.com/badeball/cypress-cucumber-preprocessor/tree/master

So far, I use following packages for the project:

_[package.json](https://github.com/nikgladkov/myCypresFramework/blob/main/package.json)_
```
"devDependencies": {
  "@badeball/cypress-cucumber-preprocessor": "latest",
  "@bahmutov/cypress-esbuild-preprocessor": "latest",
  "cypress": "latest",
  "cypress-on-fix": "latest",
  "typescript": "latest"
}
```

# Step Defenitions

For Step Defenitions, I use the following structure to separate the code:

_[support/Step_Defenitions](https://github.com/nikgladkov/myCypresFramework/tree/main/cypress/support/Step_definitions)_
```
- Step_definitions
-- Pre_conditions_steps.ts - contains the code for tests described in the Background section of the e2e feature tests
-- e2e
--- for each .feature file I create related .ts file with test implementations
```

## Step definitions paths

It is important to set the paths for step definitions.

_[package.json](https://github.com/nikgladkov/myCypresFramework/blob/main/package.json)_

```
   "stepDefinitions": [
      "cypress/support/Step_definitions/**/*"
    ]
```

_VS Code → Settings → Settings → Extentions → Cucumber → Edit in settings.json_

```
  "cucumberautocomplete.steps": [
    "cypress/support/Step_definitions/**/*"
  ],
```

# Page Selectors

I describe page elements [within classes](https://github.com/nikgladkov/myCypresFramework/tree/main/cypress/support/Selectors) and create their instances in the step definition code. This ensures that CSS selectors are not duplicated throughout the project but are stored in one place, making them easy to change. Each class represents a page or section.

_[support/Step_definitions/ContactUs.ts](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress/support/Selectors/ContactUs.ts)_
```
export class ContactUsPage {
  pageTitle = "WebDriver | Contact Us";
  url = "/Contact-Us/contactus.html";
}
```

In the step definition, I import the required selector class, create an instance, and call its properties to access the values.

_[support/Step_definitions/e2e/Demo_Test.ts](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress/support/Step_definitions/e2e/Demo_Test.ts)_
```
import * as ContactUs from "../../Selectors/ContactUs";
const contactUsPage = new ContactUs.ContactUsPage();

Given(/^Open the Contact Us page$/, () => {
  cy.visit(contactUsPage.url);
});
```

For detecting markup selectors during tests implemintation I use [Ranorex Selocity plugin](https://chromewebstore.google.com/detail/ranorex-selocity/ocgghcnnjekfpbmafindjmijdpopafoe) for Chrome (it was recommended by author of the udemy course and works fine so far despite Google's warnings).

# Test Data

Similar to how I handle page selectors, I describe test inputs and other useful data [within classes](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress/support/Test_Data/Test_Data.ts), and import needed classes to the step defenition code.

_[support/Test_Data/Test_Data.ts](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress/support/Test_Data/Test_Data.ts)_
```
export class DefaultUser {
  firstName = "Michael";
  lastName = "Scott";
  email = "michael_scott65_rocks@dundermifflin.com";
}
```

_[support/Step_definitions/e2e/Demo_Test.ts](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress/support/Step_definitions/e2e/Demo_Test.ts)_
```
import * as TestData from "../../Test_Data/Test_Data";
const defaultUser = new TestData.DefaultUser();

Then(/^I type a first name$/, () => {
  cy.get(contactUsForm.firstNameInput).type(defaultUser.firstName);
});
```

# Test execution

## CI/CD

The infrastructure for my work project is set up via Azure and Docker. Release deployment runs the prescribed tests.

[Dockerfile.build](https://github.com/nikgladkov/myCypresFramework/blob/main/Dockerfile.build) file consists of a [script](#scripting) for running tests.

```
CMD ["bash", "-c", "npm run all-smokes"]
```

_I am not an advanced user of Docker, if you were to ask for further details. I plan to figure it out, set up the Docker build, and publish it on GitHub for this repo to provide a more in-depth overview of this part._

## Scripting

I add additional scripts to run tests by tags in headless mode.

_[package.json](https://github.com/nikgladkov/myCypresFramework/blob/main/package.json)_

```
   "scripts": {
    "all-smokes": "cypress run --headless --env TAGS=\"@Smoke and not @Draft\""
  }
```
The script running by command ```npm run all-smokes```.

To run tests only with specific tags, I configured the project based on [the solution described on Stack Overflow](https://stackoverflow.com/questions/73076496/cucumber-tags-are-not-working-after-cypress-and-cucumber-preprocessor-upgrade). Otherwise, Cypress will try to invoke unTagged tests and mark them as skipped in the test run results. This can be a problem if you have draft tests in the repository.

_[package.json](https://github.com/nikgladkov/myCypresFramework/blob/main/package.json)_

```
  "cypress-cucumber-preprocessor": {
    "filterSpecs": true,
    "omitFiltered": true
  }
```

# Reporting

## Reporting via the Cucumber preprocessor

The core package [@badeball/cypress-cucumber-preprocessor](https://www.npmjs.com/package/@badeball/cypress-cucumber-preprocessor/v/5.0.0-rc2) generates report files. Please refer to the [documentation](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/messages-report.md) for more details.

The project settings for reporting are outlined below. Report artifacts are created in the [reports](https://github.com/nikgladkov/myCypresFramework/tree/main/cypress/reports/cucumber-preprocessor) folder ([screenshots](https://github.com/nikgladkov/myCypresFramework/tree/main/cypress/screenshots) folder is generated only for failed tests).

_[package.json](https://github.com/nikgladkov/myCypresFramework/blob/main/package.json)_

```
"cypress-cucumber-preprocessor": {
    "stepDefinitions": [
      "cypress/support/Step_definitions/**/*"
    ],
    "html": {
      "enabled": true,
      "output": "cypress/reports/cucumber-preprocessor/report.html"
    },
    "messages": {
      "enabled": true,
      "output": "cypress/reports/cucumber-preprocessor/report.ndjs"
    },
    "json": {
      "enabled": true,
      "formatter": "cucumber-json-report-formatter",
      "output": "cypress/reports/cucumber-preprocessor/report.json"
    }
  }
```

_[cypress.config.js](https://github.com/nikgladkov/myCypresFramework/blob/main/cypress.config.js)_

```
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
```

## Uploading the report artifacts to cloud storage

_[upload_to_blob.sh](https://github.com/nikgladkov/myCypresFramework/blob/main/upload_to_blob.sh)_ script creates a separate reports folder after tests have run and uploads the created test artifacts to Azure Blob Storage.

_[Dockerfile.build](https://github.com/nikgladkov/myCypresFramework/blob/main/Dockerfile.build)_

```
CMD ["bash", "-c", "npm run testTest; bash upload_to_blob.sh"]
```

## To be described...:)

### Additional report plugins
- cypress-mochawesome-reporter plugin 
https://www.npmjs.com/package/cypress-mochawesome-reporter
file:///Users/nik/MyCypressFramework/myCypresFramework/cypress/reports/index.html

- cypress-multi-reporters
https://www.npmjs.com/package/cypress-multi-reporters

- cypress-qase-reporter
https://www.npmjs.com/package/cypress-qase-reporter

### Test Environment
### Setting Up the Docker deployment on the github