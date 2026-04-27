package org.boduha.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.boduha.server.model.Alternative;
import org.boduha.server.model.Question;
import org.boduha.server.model.QuestionType;

import org.springframework.stereotype.Service;

/**
 * A question service to generates questions.
 */
@Service
public class QuestionService {

    /**
     * 
     */
    private final Random random = new Random();

    /**
     * 
     * @param state
     * @return
     */
    public Question nextQuestion(UserState state) {
        state.recordQuestionServed();
        if (state.getQuestionsServedInRound() % 4 == 0) {
            if (random.nextBoolean()) {
                return generateTableQuestion(state);
            }
            return generateParityQuestion(state);
        }

        return generatePlainQuestion(state);
    }

    /**
     * 
     * @param state
     * @return
     */
    private Question generatePlainQuestion(UserState state) {
        int number = state.nextNumber();

        return new Question(
                number,
                number,
                QuestionType.PLAIN,
                "Convert from decimal to binary",
                generateAlternatives(number, state),
                null);
    }

    /**
     * 
     * @param state
     * @return
     */
    private Question generateParityQuestion(UserState state) {
        int number = state.nextNumber();
        String binary = toBinary(number, state.getBits());

        String correctText = binary.endsWith("0") ? "Even" : "Odd";
        String wrongText = correctText.equals("Even") ? "Odd" : "Even";

        List<String> values = new ArrayList<>(List.of(correctText, wrongText));
        Collections.shuffle(values, random);

        List<Alternative> alternatives = new ArrayList<>();
        for (int i = 0; i < values.size(); i++) {
            String id = i == 0 ? "a" : "b";
            alternatives.add(new Alternative(id, values.get(i)));
        }

        Alternative correctAlternative = alternatives.stream()
                .filter(a -> a.label().equals(correctText))
                .findFirst()
                .orElseThrow();

        state.setCorrectAlternative(correctAlternative);

        return new Question(
                2000 + state.getQuestionsServedInRound(),
                number,
                QuestionType.PARITY,
                "Is this binary number even or odd?",
                alternatives,
                List.of(new Question.TableRow("", binary)));
    }

    /**
     * 
     * @param state
     * @return
     */
    private Question generateTableQuestion(UserState state) {
        TablePattern pattern = nextTablePattern(state);
        int bits = state.getBits();

        String correctBinary = toBinary(pattern.missingDecimal,state.getBits());
        String wrongBinary = generateWrongBinary(pattern, state);

        List<String> values = new ArrayList<>();
        values.add(correctBinary);
        values.add(wrongBinary);

        Collections.shuffle(values, random);

        List<Alternative> alternatives = new ArrayList<>();
        for (int i = 0; i < values.size(); i++) {
            String id = i == 0 ? "a" : "b";
            Alternative alt = new Alternative(id, values.get(i));
            alternatives.add(alt);

            if (values.get(i).equals(correctBinary)) {
                state.setCorrectAlternative(alt);
            }
        }

        return new Question(
                1000 + state.getQuestionsServedInRound(),
                pattern.missingDecimal,
                QuestionType.TABLE,
                "Follow the pattern",
                alternatives,
                List.of(
                        new Question.TableRow(String.valueOf(pattern.first), toBinary(pattern.first, bits)),
                        new Question.TableRow(String.valueOf(pattern.second), toBinary(pattern.second, bits)),
                        new Question.TableRow(String.valueOf(pattern.missingDecimal), "?")));
    }

    /**
     * 
     */
    private record TablePattern(int first, int second, int missingDecimal) {
    }

    /**
     * 
     * @return
     */
    private TablePattern nextTablePattern(UserState state) {
        List<TablePattern> patterns = List.of(
                new TablePattern(1, 2, 3),
                new TablePattern(15, 14, 13),
                new TablePattern(1, 3, 5),
                new TablePattern(12, 13, 14),
                new TablePattern(5, 6, 7),
                new TablePattern(7, 8, 9),
                new TablePattern(10, 12, 14),
                new TablePattern(11, 13, 15));

        int index = state.getQuestionsServedInRound() % patterns.size();
        return patterns.get(index);
    }

    /**
     * 
     * @param pattern
     * @return
     */
    private String generateWrongBinary(TablePattern pattern, UserState state) {
        int bits = state.getBits();
        String correct = toBinary(pattern.missingDecimal, bits);

        List<String> candidates = new ArrayList<>();

        candidates.add(toBinary(Math.max(0, pattern.missingDecimal - 1), bits)); // off by one down
        candidates.add(toBinary(pattern.missingDecimal + 1, bits)); // off by one up
        candidates.add(toBinary(pattern.second, bits)); // copies previous answer
        candidates.add(oneBitWrong(correct)); // one bit mistake
        candidates.add(shiftLeft(correct)); // shift error
        candidates.add(shiftRight(correct)); // shift error
        candidates.add(reverse(correct)); // reversed bits

        candidates.removeIf(value -> value == null || value.equals(correct));

        Collections.shuffle(candidates, random);

        if (!candidates.isEmpty()) {
            return candidates.get(0);
        }

        String fallback;
        do {
            fallback = randomBinary(correct.length());
        } while (fallback.equals(correct));

        return fallback;
    }

    /**
     * 
     * @param number
     * @param state
     * @return
     */
    private List<Alternative> generateAlternatives(int number, UserState state) {
        String correct = toBinary(number,state.getBits());

        Set<String> candidates = new LinkedHashSet<>();
        candidates.add(correct);
        candidates.add(oneBitWrong(correct));
        candidates.add(shiftLeft(correct));
        candidates.add(shiftRight(correct));
        candidates.add(reverse(correct));
        candidates.add(bitwiseNot(correct));

        int width = correct.length();

        while (candidates.size() < 4) {
            candidates.add(randomBinary(width));
        }

        candidates.remove(null);

        List<String> values = new ArrayList<>(candidates);
        Collections.shuffle(values, random);

        List<String> selected = new ArrayList<>();
        selected.add(correct);

        for (String value : values) {
            if (!value.equals(correct) && selected.size() < 4) {
                selected.add(value);
            }
        }

        while (selected.size() < 4) {
            String fallback = randomBinary(width);
            if (!fallback.equals(correct) && !selected.contains(fallback)) {
                selected.add(fallback);
            }
        }

        Collections.shuffle(selected, random);

        List<Alternative> result = new ArrayList<>();
        char id = 'a';

        for (String value : selected) {
            String alternativeId = String.valueOf(id++);
            result.add(new Alternative(alternativeId, value));

            if (value.equals(correct)) {
                state.setCorrectAlternative(new Alternative(alternativeId, value));
            }
        }

        return result;
    }

    /**
     * 
     * @param number
     * @return
     */
private String toBinary(int value, int bits) {
    String padded = String.format("%" + bits + "s", Integer.toBinaryString(value))
            .replace(' ', '0');

    if (bits <= 4) {
        return padded;
    }

    return padded.substring(0, 4) + " " + padded.substring(4);
}

    /**
     * 
     * @param bits
     * @return
     */
    private String oneBitWrong(String bits) {
        char[] chars = bits.toCharArray();
        int index = random.nextInt(chars.length);
        chars[index] = chars[index] == '0' ? '1' : '0';
        return new String(chars);
    }

    /**
     * 
     * @param bits
     * @return
     */
    private static String shiftLeft(String bits) {
        return bits.substring(1) + "0";
    }

    /**
     * 
     * @param bits
     * @return
     */
    private static String shiftRight(String bits) {
        return "0" + bits.substring(0, bits.length() - 1);
    }

    /**
     * 
     * @param bits
     * @return
     */
    private static String reverse(String bits) {
        return new StringBuilder(bits).reverse().toString();
    }

    /**
     * 
     * @param bits
     * @return
     */
    private static String bitwiseNot(String bits) {
        StringBuilder sb = new StringBuilder();

        for (char c : bits.toCharArray()) {
            sb.append(c == '0' ? '1' : '0');
        }

        return sb.toString();
    }

    /**
     * 
     * @param width
     * @return
     */
    private String randomBinary(int width) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < width; i++) {
            sb.append(random.nextBoolean() ? '1' : '0');
        }

        return sb.toString();
    }
}