import { useState } from "react"

type Choice = {
  id: string
  label: string
}

const choices: Choice[] = [
  { id: "a", label: "101010" },
  { id: "b", label: "100101" },
  { id: "c", label: "110010" },
  { id: "d", label: "111000" },
]

const questionText = "Convert 42 (decimal) to binary:"
const correctAnswer = "101010"

type ScreenState = "question" | "correct" | "notQuite"

export default function Question42() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("question")

  function handleCheck() {
    if (!selectedAnswer) return
    setScreenState(selectedAnswer === correctAnswer ? "correct" : "notQuite")
  }

  function handleContinue() {
    setSelectedAnswer(null)
    setScreenState("question")
  }

  if (screenState === "correct") {
    return (
      <main style={styles.main}>
        <h1>Correct!</h1>
        <p>42 in binary is 101010.</p>

        <button type="button" onClick={handleContinue} style={styles.actionButton}>
          Continue
        </button>
      </main>
    )
  }

  if (screenState === "notQuite") {
    return (
      <main style={styles.main}>
        <h1>Not quite!</h1>
        <p>Almost there.</p>
        <p>Correct answer is: 42 in binary is 101010.</p>

        <button type="button" onClick={handleContinue} style={styles.actionButton}>
          Continue
        </button>
      </main>
    )
  }

  return (
    <main style={styles.main}>
      <h1>Question</h1>
      <p>{questionText}</p>

      <div style={styles.choicesGrid}>
        {choices.map((choice) => {
          const isSelected = selectedAnswer === choice.label

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => setSelectedAnswer(choice.label)}
              style={{
                ...styles.choiceButton,
                border: isSelected ? "2px solid black" : "1px solid #ccc",
                background: isSelected ? "#f0f0f0" : "white",
              }}
            >
              {choice.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleCheck}
        disabled={!selectedAnswer}
        style={{
          ...styles.actionButton,
          background: selectedAnswer ? "white" : "#f5f5f5",
          cursor: selectedAnswer ? "pointer" : "not-allowed",
        }}
      >
        Check
      </button>
    </main>
  )
}

const styles = {
  main: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "24px",
    textAlign: "center" as const,
  },
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
    gap: "12px",
    maxWidth: "480px",
    margin: "0 auto 16px",
  },
  choiceButton: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  actionButton: {
    marginTop: "16px",
    padding: "12px 20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
  },
}