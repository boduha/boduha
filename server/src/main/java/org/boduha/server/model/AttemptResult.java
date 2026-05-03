package org.boduha.server.model;

/**
 * A result from an answer.
 */
public record AttemptResult(Integer questionId, String selected, boolean correct, Alternative correctAlternative) {
}
