package org.boduha.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuestionController.class)
public class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnQuestion42() throws Exception {
        mockMvc.perform(get("/question"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.statement").value("Convert 42 (decimal) to binary:"))
                .andExpect(jsonPath("$.alternatives").isArray())
                .andExpect(jsonPath("$.alternatives.length()").value(4))
                .andExpect(jsonPath("$.alternatives[0].id").value("a"))
                .andExpect(jsonPath("$.alternatives[0].label").value("101010"));
    }

    @Test
    void shouldValidateCorrectAnswer() throws Exception {
        mockMvc.perform(post("/question/42/answer")
                .contentType("application/json")
                .content("""
                            { "answer": "a" }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(true))
                .andExpect(jsonPath("$.selected").value("a"));
    }

    @Test
    void shouldValidateIncorrectAnswer() throws Exception {
        mockMvc.perform(post("/question/42/answer")
                .contentType("application/json")
                .content("""
                            { "answer": "b" }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correct").value(false));
    }
}