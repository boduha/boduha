package org.boduha.server;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.boduha.server.model.Alternative;
import org.boduha.server.model.Question;
import org.boduha.server.model.QuestionType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * 
 */
@WebMvcTest(QuestionController.class)
public class QuestionControllerTest {

        @Autowired
        private MockMvc mockMvc;
        @MockitoBean

        private QuestionService questionService;

        @Test
        void shouldReturnQuestion43() throws Exception {
                Question question43 = new Question(
                                43,
                                43,
                                QuestionType.PLAIN,
                                "Convert from decimal to binary",
                                List.of(
                                                new Alternative("a", "00101011"),
                                                new Alternative("b", "00101010"),
                                                new Alternative("c", "00101111"),
                                                new Alternative("d", "10101000")),
                                null);

                when(questionService.nextQuestion(any(UserState.class)))
                                .thenReturn(question43);

                mockMvc.perform(get("/question"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(43))
                                .andExpect(jsonPath("$.value").value(43))
                                .andExpect(jsonPath("$.type").value("PLAIN"))
                                .andExpect(jsonPath("$.statement").value("Convert from decimal to binary"))
                                .andExpect(jsonPath("$.rows").isEmpty()) // 👈 important (null → empty in JSON)
                                .andExpect(jsonPath("$.alternatives.length()").value(4))
                                .andExpect(jsonPath("$.alternatives[0].id").value("a"))
                                .andExpect(jsonPath("$.alternatives[0].label").value("00101011"));
        }

        @Test
        void shouldValidateCorrectAnswer() throws Exception {
                UserState state = new UserState(4);
                state.setCorrectAlternative(new Alternative("a", "1000"));

                mockMvc.perform(post("/question/8/answer")
                                .sessionAttr("state", state)
                                .contentType("application/json")
                                .content("""
                                                { "answer": "a" }
                                                """))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.questionId").value(8))
                                .andExpect(jsonPath("$.selected").value("a"))
                                .andExpect(jsonPath("$.correct").value(true))
                                .andExpect(jsonPath("$.correctAlternative.id").value("a"));
        }

}