package org.boduha.server.model;

import java.util.List;

/**
 * A question.
 */
public record Question(
        Integer id,
        Integer value,
        QuestionType type,
        String statement,
        List<Alternative> alternatives,
        List<TableRow> rows // nullable, only for TABLE
) {
    /**
     * 
     */
    public record TableRow(String left, String right) {
    }
}