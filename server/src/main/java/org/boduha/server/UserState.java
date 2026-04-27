package org.boduha.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

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


    private int bits;

    /**
     * 
     */
    private Alternative correctAlternative;

    public UserState(int bits) {
        this.bits = bits;
        this.random = new Random();
        this.originalValues = (IntStream.range(0, 1 << bits).boxed().toList());
        this.remaining = newShuffledCopy();
    }

    public int getBits() {
        return bits;
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