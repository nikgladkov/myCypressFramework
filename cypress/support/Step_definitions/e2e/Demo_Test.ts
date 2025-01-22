import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

import * as ContactUs from "../../Selectors/ContactUs";
const contactUsPage = new ContactUs.ContactUsPage();
const contactUsForm = new ContactUs.ContactUsForm();
const successPage = new ContactUs.SuccessPage();

import * as TestData from "../../Test_Data/Test_Data";
const defaultUser = new TestData.DefaultUser();

Given(/^Open the Contact Us page$/, () => {
  cy.visit(contactUsPage.url+'123123');
  cy.title().should("eq", contactUsPage.pageTitle);
});

Then(/^Type a first name$/, () => {
  cy.get(contactUsForm.firstNameInput).type(defaultUser.firstName);
});

Then(/^Type a last name$/, () => {
  cy.get(contactUsForm.lastNameInput).type(defaultUser.lastName);
});

Then(/^Enter an email$/, () => {
  cy.get(contactUsForm.emailInput).type(defaultUser.email);
});

Then(/^Add a Comment$/, () => {
  cy.get(contactUsForm.commentsInput).type(
    "You miss 100% of the shots you dont take. - Wayne Gretzky” by Michael Scott"
  );
});

Then(/^Click on the Submit button$/, () => {
  cy.get(contactUsForm.submitButton).click();
});

Then(/^Successful submission message is shown$/, () => {
  cy.get(successPage.successTitle).should(
    "have.text",
    successPage.successTitleExpectedText
  );
});
