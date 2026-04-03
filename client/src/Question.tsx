import { useEffect, useState } from "react"

import type { AnswerResult, AnswerSubmission, Question } from "./types"

type ScreenState = "loading" | "question" | "correct" | "notQuite" | "error"

type Props = {
  questionId: number
}

export default function Question({ questionId }: Props) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuestion() {
      try {
        const response = await fetch(`/question/${questionId}`)

        if (!response.ok) {
          throw new Error(`Failed to load question: ${response.status}`)
        }
        console.log("Loading question", questionId)
        const data: Question = await response.json()
        setQuestion(data)
        setErrorMessage(null)
        setScreenState("question")
      } catch (error) {
        console.error("Error loading question", error)
        setErrorMessage("Could not load question.")
        setScreenState("error")
      }
    }

    loadQuestion()
  }, [questionId])

  async function handleCheck() {
    if (!selectedAlternativeId || !question) return

    try {
      const submission: AnswerSubmission = { answer: selectedAlternativeId }
      const response = await fetch(`/question/${questionId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission)
      })

      if (!response.ok) {
        throw new Error(`Failed to validate answer: ${response.status}`)
      }

      const result: AnswerResult = await response.json()
      setScreenState(result.correct ? "correct" : "notQuite")
    } catch (error) {
      console.error("Error validating answer", error)
      setErrorMessage("Could not validate answer.")
      setScreenState("error")
    }
  }

  function handleContinue() {
    setSelectedAlternativeId(null)
    setScreenState("question")
  }

  if (screenState === "loading") {
    return (
      <main style={styles.main}>
        <h1>Loading...</h1>
      </main>
    )
  }

  if (screenState === "error") {
    return (
      <main style={styles.main}>
        <h1>Error</h1>
        <p>{errorMessage}</p>
      </main>
    )
  }

  if (!question) {
    return null
  }

  if (screenState === "correct") {
    const selectedLabel =
      question.alternatives.find((alternative) => alternative.id === selectedAlternativeId)?.label ?? ""

    return (
      <main style={styles.main}>
        <h1>Correct!</h1>
        <p>{question.id} in binary is {selectedLabel}.</p>

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

        <button type="button" onClick={handleContinue} style={styles.actionButton}>
          Continue
        </button>
      </main>
    )
  }

  return (
    <main style={styles.main}>
      <h1>Question</h1>
      <p>{question.statement}</p>

      <div style={styles.choicesGrid}>
        {question.alternatives.map((alternative) => {
          const isSelected = selectedAlternativeId === alternative.id

          return (
            <button
              key={alternative.id}
              type="button"
              onClick={() => setSelectedAlternativeId(alternative.id)}
              style={{
                ...styles.choiceButton,
                border: isSelected ? "2px solid black" : "1px solid #ccc",
                background: isSelected ? "#f0f0f0" : "white",
              }}
            >
              {alternative.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleCheck}
        disabled={!selectedAlternativeId}
        style={{
          ...styles.actionButton,
          background: selectedAlternativeId ? "white" : "#f5f5f5",
          cursor: selectedAlternativeId ? "pointer" : "not-allowed",
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
    color: "white",
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
    color: "black",
    background: "white",
    border: "1px solid #ccc",
  },
  actionButton: {
    marginTop: "16px",
    padding: "12px 20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "white",
    color: "black",
    cursor: "pointer",
  },
}