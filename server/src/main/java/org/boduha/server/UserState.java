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
    private final Random random;

    private static final int ROUND_LENGTH = 8;
    private int bits;
    private int questionsServedInRound = 0;
    /**
     * 
     */
    private Alternative correctAlternative;

    public UserState(int bits) {
        this.bits = bits;
        this.random = new Random();
this.remaining = newShuffledValues(bits);    
}

    public int getBits() {
        return bits;
    }

    public void recordQuestionServed() {
        if (questionsServedInRound >= ROUND_LENGTH) {
            questionsServedInRound = 0;
            bits = bits == 4 ? 8 : 4;
                    remaining = newShuffledValues(bits);
        }
        questionsServedInRound++;
    }

    public int getQuestionsServedInRound() {
        return questionsServedInRound;
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
                    remaining = newShuffledValues(bits);
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

private List<Integer> newShuffledValues(int bits) {
    List<Integer> values = new ArrayList<>(
            IntStream.range(0, 1 << bits).boxed().toList()
    );
    Collections.shuffle(values, random);
    return values;
}

}