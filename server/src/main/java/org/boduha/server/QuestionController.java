package org.boduha.server;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuestionController {

    @GetMapping("/question/42")
    public Map<String, Object> getQuestion() {
        return Map.of(
                "id", 42,
                "statement", "Converta 42 para binário",
                "value", 42,
                "expectedAnswer", "101010");
    }
}