package org.boduha.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class UserState {

    private List<Integer> remaining;
    private final List<Integer> originalValues;
    private final Random random;
    private String correctAnswerId;

    public UserState(List<Integer> values) {
        this(values, new Random());
    }

    public UserState(List<Integer> values, Random random) {
        if (values == null || values.isEmpty()) {
            throw new IllegalArgumentException("values must not be null or empty");
        }
        if (values.stream().anyMatch(value -> value == null)) {
            throw new IllegalArgumentException("values must not contain null");
        }
        if (random == null) {
            throw new IllegalArgumentException("random must not be null");
        }

        this.random = random;
        this.originalValues = new ArrayList<>(values);
        this.remaining = newShuffledCopy();
    }

    public boolean hasNext() {
        return !remaining.isEmpty();
    }

    public int nextNumber() {
        if (remaining.isEmpty()) {
            remaining = newShuffledCopy();
        }

        return remaining.remove(0);
    }

    public String getCorrectAnswerId() {
        return correctAnswerId;
    }

    public void setCorrectAnswerId(String correctAnswerId) {
        this.correctAnswerId = correctAnswerId;
    }

    public int remainingCount() {
        return remaining.size();
    }

    private List<Integer> newShuffledCopy() {
        List<Integer> shuffled = new ArrayList<>(originalValues);
        Collections.shuffle(shuffled, random);
        return shuffled;
    }
}