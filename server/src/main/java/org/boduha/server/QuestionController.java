package org.boduha.server;

import java.util.stream.IntStream;

import org.boduha.server.model.AnswerResult;
import org.boduha.server.model.AnswerSubmission;
import org.boduha.server.model.Question;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import jakarta.servlet.http.HttpSession;

/**
 * Question controller uses a service that generates a question and checks its answer.
 */
@RestController
public class QuestionController {

    /**
     * 
     */
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);

    /**
     * 
     */
    private final QuestionService questionService;

    /**
     * 
     * @param questionService
     */
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

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
            state = new UserState(IntStream.range(0, 16).boxed().toList());
            session.setAttribute("state", state);
        }

        Question q = questionService.nextQuestion(state);
        log.info("Sending question: {} {}", q);

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
    public AnswerResult checkAnswer(
            @PathVariable Integer id,
            @RequestBody AnswerSubmission submission,
            @SessionAttribute(name = "state") UserState state) {

        boolean correct = submission.answer().equals(state.getCorrectAlternative().id());

        return new AnswerResult(id, submission.answer(), correct, state.getCorrectAlternative());
    }
}