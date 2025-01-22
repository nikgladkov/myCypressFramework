#https://app.qase.io/case/test-id

Feature: Demo Test

    Background: Pre-conditions
        Given Open the site by base Url

    @High @Smoke @DemoTest
    Scenario: Valid Contact Us Form Submission
        Given Open the Contact Us page
        Then Type a first name
        And Type a last name
        And Enter an email
        And Add a Comment
        And Click on the Submit button
        Then Successful submission message is shown

    @Draft @DemoTest
    Scenario: Draft
        Given Open the Contact Us page