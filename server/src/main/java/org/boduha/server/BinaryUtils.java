package org.boduha.server;

public class BinaryUtils {

    /**
     * 
     * @param number
     * @return
     */
    public static String toBinary(int value, int bits) {
        String padded = String.format("%" + bits + "s", Integer.toBinaryString(value))
                .replace(' ', '0');

        return padded;
    }

}
