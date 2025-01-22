/// <reference types="cypress"/>

import { Given } from "@badeball/cypress-cucumber-preprocessor";

Given(/^Open the site by base Url$/, () => {
  cy.visit("/");
});
