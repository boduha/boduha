package org.boduha.server;

import org.boduha.server.model.AttemptResult;
import org.boduha.server.model.AnswerSubmission;
import org.boduha.server.model.Question;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import jakarta.servlet.http.HttpSession;

/**
 * Handles the main question-and-answer flow of a Boduha session.
 *
 * <p>
 * This controller exposes endpoints for requesting the next question and
 * submitting an answer. It keeps the current {@link UserState} in the HTTP
 * session so each user can progress through an independent practice sequence.
 *
 * <p>
 * The controller is responsible for session flow, while
 * {@link QuestionService} is responsible for question generation.
 */
@RestController
public class QuestionController {

    /**
     * Logger for question flow events.
     */
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);

    /**
     * Service used to generate questions for the current user state.
     */
    @Autowired
    private QuestionService questionService;

    /**
     * 
     * @param state
     * @param session
     * @return
     */
    @GetMapping("/question")
    public Question getQuestion(
            @SessionAttribute(name = "state", required = false) UserState state,
            HttpSession session) {

        if (state == null) {
            state = new UserState(4);
            session.setAttribute("state", state);
        }

        Question q = questionService.nextQuestion(state);
        log.info("Sending question: {}", q);

        return q;
    }

    /**
     * 
     * @param id
     * @param submission
     * @param state
     * @return
     */
    @PostMapping("/question/{id}/answer")
    public AttemptResult checkAnswer(
            @PathVariable Integer id,
            @RequestBody AnswerSubmission submission,
            @SessionAttribute(name = "state") UserState state) {

        boolean correct = submission.answer().equals(state.getCorrectAlternative().id());

        return new AttemptResult(id, submission.answer(), correct, state.getCorrectAlternative());
    }
}