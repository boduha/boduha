package org.boduha.server;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuestionController {

    @GetMapping("/question/42")
    public Map<String, Object> getQuestion42() {
        return Map.of(
            "id", 42,
            "statement", "Convert 42 (decimal) to binary:",
            "alternatives", List.of(
                Map.of("id", "a", "label", "101010", "correct", true),
                Map.of("id", "b", "label", "100101", "correct", false),
                Map.of("id", "c", "label", "110010", "correct", false),
                Map.of("id", "d", "label", "111000", "correct", false)
            )
        );
    }
}
