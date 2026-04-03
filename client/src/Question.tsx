import { useEffect, useState } from "react"

type Alternative = {
  id: string
  label: string
}

type Question = {
  id: number
  statement: string
  alternatives: Alternative[]
}

type AnswerResult = {
  questionId: number
  selected: string
  correct: boolean
}

type ScreenState = "loading" | "question" | "correct" | "notQuite" | "error"

export default function Question42() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuestion() {
      try {
        const response = await fetch("/question/42")

        if (!response.ok) {
          throw new Error(`Failed to load question: ${response.status}`)
        }

        const data: Question = await response.json()
        setQuestion(data)
        setScreenState("question")
      } catch (error) {
        console.error("Error loading question", error)
        setErrorMessage("Could not load question.")
        setScreenState("error")
      }
    }

    loadQuestion()
  }, [])

  async function handleCheck() {
    if (!selectedAnswer || !question) return

    try {
      const response = await fetch(`/question/${question.id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: selectedAnswer }),
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
    setSelectedAnswer(null)
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
      question.alternatives.find((alternative) => alternative.id === selectedAnswer)?.label ?? ""

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
          const isSelected = selectedAnswer === alternative.id

          return (
            <button
              key={alternative.id}
              type="button"
              onClick={() => setSelectedAnswer(alternative.id)}
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