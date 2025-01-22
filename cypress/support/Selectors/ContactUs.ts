export class ContactUsPage {
  pageTitle = "WebDriver | Contact Us";
  url = "/Contact-Us/contactus.html";
}

export class ContactUsForm {
  contactUsTitle = "h2[name='contactme']";
  firstNameInput = "form#contact_form > input[name='first_name']";
  lastNameInput = "form#contact_form > input[name='last_name']";
  emailInput = "form#contact_form > input[name='email']";
  commentsInput = "form#contact_form > textarea[name='message']";
  resetButton = "[type='reset']";
  submitButton = "[type='submit']";
}

export class SuccessPage {
  pageName = "Contact form Thank you";
  url = "/Contact-Us/contact-form-thank-you.html";
  successTitle = "h1";
  successTitleExpectedText = "Thank You for your Message!";
}

export class ErrorHandlerPage {
  pageName = "Contact form handler";
  title = "Contact form handler";
  url = "/Contact-Us/contact_us.php";
  errorMessage = "body";
  errorMessageText = "Error: Invalid email address";
}