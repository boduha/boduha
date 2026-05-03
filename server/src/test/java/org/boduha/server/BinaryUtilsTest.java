package org.boduha.server;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class BinaryUtilsTest {

    @Test
    void shouldPadTo8Bits() {
        assertEquals("00000101", BinaryUtils.toBinary(5, 8));
    }

    @Test
    void shouldPadTo4Bits() {
        assertEquals("0101", BinaryUtils.toBinary(5, 4));
    }

    @Test
    void shouldHandleZero() {
        assertEquals("00000000", BinaryUtils.toBinary(0, 8));
    }

    @Test
    void shouldHandleMaxValue() {
        assertEquals("11111111", BinaryUtils.toBinary(255, 8));
    }
}