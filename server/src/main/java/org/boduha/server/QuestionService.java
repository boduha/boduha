package org.boduha.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    private final Random random = new Random();
    private int questionCount = 0;

    public synchronized Question nextQuestion(UserState state) {
        questionCount++;

        if (questionCount % 4 == 0) {
            return generateTableQuestion(state);
        }

        return generatePlainQuestion(state);
    }

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

    private Question generateTableQuestion(UserState state) {
        state.setCorrectAlternative(new Alternative("a", "1000"));

        return new Question(
                1000 + questionCount,
                8,
                QuestionType.TABLE,
                "Follow the pattern",
                List.of(new Alternative("a", "1000"),
                        new Alternative("b", "0111")),
                List.of(new Question.TableRow("2", "10"),
                        new Question.TableRow("4", "100"),
                        new Question.TableRow("8", "?")));
    }

    private List<Alternative> generateAlternatives(int number, UserState state) {
        String correct = toBinary(number);

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

    private String toBinary(int number) {
        String raw = Integer.toBinaryString(number);
        int width = Math.max(4, raw.length());
        return String.format("%" + width + "s", raw).replace(' ', '0');
    }

    private String oneBitWrong(String bits) {
        char[] chars = bits.toCharArray();
        int index = random.nextInt(chars.length);
        chars[index] = chars[index] == '0' ? '1' : '0';
        return new String(chars);
    }

    private String shiftLeft(String bits) {
        return bits.substring(1) + "0";
    }

    private String shiftRight(String bits) {
        return "0" + bits.substring(0, bits.length() - 1);
    }

    private String reverse(String bits) {
        return new StringBuilder(bits).reverse().toString();
    }

    private String bitwiseNot(String bits) {
        StringBuilder sb = new StringBuilder();

        for (char c : bits.toCharArray()) {
            sb.append(c == '0' ? '1' : '0');
        }

        return sb.toString();
    }

    private String randomBinary(int width) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < width; i++) {
            sb.append(random.nextBoolean() ? '1' : '0');
        }

        return sb.toString();
    }
}