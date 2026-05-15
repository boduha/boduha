package org.boduha.server.model;

import java.util.List;

/**
 * A question of one of the three types available.
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
     * A row for table questions.
     */
    public record TableRow(String left, String right) {
    }
}