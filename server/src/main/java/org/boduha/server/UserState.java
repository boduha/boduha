package org.boduha.server;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class UserState {

    private List<Integer> remaining;
    private final List<Integer> remainingCopy;
    private final Random random;
    private String correctAnswerId;

    public UserState(List<Integer> values) {
        this(values, new Random());
    }

    public UserState(List<Integer> values, Random random) {
        this.random = random;
        this.remaining = new ArrayList<>(values);
        this.remainingCopy = new ArrayList<>(values);
    }

    public boolean hasNext() {
        return !remaining.isEmpty();
    }

    public int nextNumber() {
        if (!hasNext()) {
            // throw new IllegalStateException("No more numbers available");
            // for testing purposes on demo 2
            // we reset number list so we can keep using the same user
            // when testing
            this.remaining = new ArrayList<>(remainingCopy);

        }

        int index = random.nextInt(remaining.size());
        return remaining.remove(index);
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
}