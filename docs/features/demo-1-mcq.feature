Feature: Practice - Multiple choice question about base conversion

  So that I receive immediate feedback
  As a student
  I want to answer a multiple choice question

  Background:
    Given the boduha demo is running

  @demo1 @e2e
  Scenario Outline: Student answers the question and receives feedback
    When I open the demo home page
    And I start the lesson
    Then I should see the question "Convert 42 (decimal) to binary."

    When I select the choice "<actualChoice>"
    And I check the answer
    Then I should see the result "<resultLabel>"
    And I should see an explanation containing "<expectedChoice>"

    Examples:
      | actualChoice | expectedChoice | resultLabel |
      | 101010       | 101010         | Correct     |
      | 101011       | 101010         | Not quite   |