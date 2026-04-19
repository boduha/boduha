package org.boduha.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import org.boduha.server.model.Alternative;

/**
 * User state tracks user activity.
 */
public class UserState {

    /**
     * 
     */
    private List<Integer> remaining;
    
    /**
     * 
     */
    private final List<Integer> originalValues;
    
    /**
     * 
     */
    private final Random random;
    
    /**
     * 
     */
    private Alternative correctAlternative;

    /**
     * 
     * @param values
     */
    public UserState(List<Integer> values) {
        this(values, new Random());
    }

    /**
     * 
     * @param values
     * @param random
     */
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

    /**
     * 
     * @return
     */
    public boolean hasNext() {
        return !remaining.isEmpty();
    }

    /**
     * 
     * @return
     */
    public int nextNumber() {
        if (remaining.isEmpty()) {
            remaining = newShuffledCopy();
        }

        return remaining.remove(0);
    }

    /**
     * 
     * @return
     */
    public Alternative getCorrectAlternative() {
        return correctAlternative;
    }

    /**
     * 
     * @param correctAlternative
     */
    public void setCorrectAlternative(Alternative correctAlternative) {
        this.correctAlternative = correctAlternative;
    }

    /**
     * 
     * @return
     */
    public int remainingCount() {
        return remaining.size();
    }

    /**
     * 
     * @return
     */
    private List<Integer> newShuffledCopy() {
        List<Integer> shuffled = new ArrayList<>(originalValues);
        Collections.shuffle(shuffled, random);
        return shuffled;
    }

}