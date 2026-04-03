package org.boduha.server;

public record AnswerResult(Integer questionId, String selected, boolean correct) {}
