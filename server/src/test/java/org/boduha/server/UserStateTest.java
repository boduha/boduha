package org.boduha.server;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class UserStateTest {

    @Test
    void shouldSwitchTo8BitsAfter8Questions() {
        UserState state = new UserState(4);

        for (int i = 0; i < 8; i++) {
            state.recordQuestionServed();
        }
        // Need one more recordQuestionServed() call to move to 8 bit
        // This call enters as 4 bit, then exits on 8 bit
        // This is needed because we need to call recordQuestionServed()
        // before the question generation.
        // Generation is called in more than one place, on a return.
        state.recordQuestionServed();

        assertEquals(8, state.getBits());
    }

}
