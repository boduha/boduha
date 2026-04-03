package org.boduha.server;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuestionController {

    @GetMapping("/question/{id}")
    public Question getQuestion(@PathVariable Integer id) {
        return new Question(
                42,
                "Convert 42 (decimal) to binary:",
                List.of(
                        new Alternative("a", "101010"),
                        new Alternative("b", "100101"),
                        new Alternative("c", "110010"),
                        new Alternative("d", "111000")));
    }

    @PostMapping("/question/{id}/answer")
    public AnswerResult checkAnswer(
            @PathVariable Integer id,
            @RequestBody AnswerSubmission submission) {

        boolean correct = "a".equals(submission.answer());

        return new AnswerResult(id, submission.answer(), correct);
    }
}