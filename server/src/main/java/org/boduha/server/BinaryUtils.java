package org.boduha.server;

/**
 * A utility class to help with 8-bit and 4-bit formating.
 */
public class BinaryUtils {

    /**
     * Convert a decimal value to binary format with a given bits length.
     * @param number
     * @return
     */
    public static String toBinary(int value, int bits) {
        String padded = String.format("%" + bits + "s", Integer.toBinaryString(value))
                .replace(' ', '0');

        return padded;
    }

}
