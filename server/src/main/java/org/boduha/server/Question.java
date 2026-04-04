package org.boduha.server;

import java.util.List;

public record Question(Integer id, QuestionType type, String statement, List<Alternative> alternatives) {}
