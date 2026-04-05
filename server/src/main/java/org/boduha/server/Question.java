package org.boduha.server;

import java.util.List;

public record Question(
        Integer id,
        QuestionType type,
        String statement,
        List<Alternative> alternatives,
        List<TableRow> rows // nullable, only for TABLE
) {
    public record TableRow(String left, String right) {
    }
}