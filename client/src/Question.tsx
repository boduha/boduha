import { useEffect, useState } from "react"
import { logger } from "./logger"

import type { AnswerResult, AnswerSubmission, Question } from "./types"

type ScreenState = "loading" | "question" | "correct" | "notQuite" | "error"

export default function Question() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function loadQuestion() {
    try {
      setScreenState("loading")
      logger.debug("[BODUHA][CLIENT] Loading question")

      const response = await fetch(`/question`)

      if (!response.ok) {
        throw new Error(`Failed to load question: ${response.status}`)
      }

      const data: Question = await response.json()

      logger.debug("[BODUHA][CLIENT] Received question:", data)

      setQuestion(data)
      setSelectedAlternativeId(null)
      setErrorMessage(null)
      setScreenState("question")
    } catch (error) {
      logger.error("Error loading question", error)
      setErrorMessage("Could not load question.")
      setScreenState("error")
    }
  }

  useEffect(() => {
    loadQuestion()
  }, [])

  async function handleCheck() {
    if (!selectedAlternativeId || !question) return

    try {
      const submission: AnswerSubmission = { answer: selectedAlternativeId }
      const response = await fetch(`/question/${question.id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        throw new Error(`Failed to validate answer: ${response.status}`)
      }

      const result: AnswerResult = await response.json()
      setScreenState(result.correct ? "correct" : "notQuite")
    } catch (error) {
      logger.error("Error validating answer", error)
      setErrorMessage("Could not validate answer.")
      setScreenState("error")
    }
  }

  async function handleContinue() {
    await loadQuestion()
  }

  if (screenState === "loading") {
    return (
      <main style={styles.main}>
        <section style={styles.centeredState}>
          <h1 style={styles.statusTitle}>Loading...</h1>
        </section>
      </main>
    )
  }

  if (screenState === "error") {
    return (
      <main style={styles.main}>
        <section style={styles.centeredState}>
          <h1 style={styles.statusTitle}>Error</h1>
          <p style={styles.feedbackText}>{errorMessage}</p>
        </section>
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
        <section style={styles.centeredState}>
          <div style={styles.feedbackPanelCorrect}>
            <h1 style={styles.feedbackTitle}>Correct!</h1>
            <p style={styles.feedbackText}>
              {question.id} in binary is <strong>{selectedLabel}</strong>.
            </p>
          </div>
        </section>
        <div style={styles.separator} />

        <div style={styles.inner}>
          <div style={styles.bottomBarInner}></div>
          <section style={styles.bottomBar}>
            <div style={styles.bottomBarInner}>

              <button type="button" onClick={handleContinue} style={styles.primaryButton}>
                Continue
              </button>
            </div>

          </section>
        </div>

      </main>
    )
  }

  if (screenState === "notQuite") {
    return (
      <main style={styles.main}>
        <section style={styles.centeredState}>
          <div style={styles.feedbackPanelNotQuite}>
            <h1 style={styles.feedbackTitle}>Not quite!</h1>
            <p style={styles.feedbackText}>Almost there.</p>
          </div>
        </section>

        <div style={styles.inner}>
          <div style={styles.bottomBarInner}></div>
        <section style={styles.bottomBar}>
          <div style={styles.bottomBarInner}>
            <button type="button" onClick={handleContinue} style={styles.primaryButton}>
              Continue
            </button>
          </div>

        </section>
          </div>

      </main>
    )
  }

  const [ac, ...restParts] = question.statement.split(" ")
  const rest = restParts.join(" ")

  return (
    <main style={styles.main}>

      <section style={styles.content}>
        <div style={styles.inner}>

          <div style={styles.headerBlock}>
            <h1 style={styles.promptTitle}>
              <span style={styles.action}>{ac}</span> {rest}
            </h1>
          </div>

          {question.type === "PLAIN" && (
            <p style={styles.expression}>{question.id} = ?</p>
          )}

          {question.type === "TABLE" && question.rows && (
            <table style={styles.table}>
              <tbody>
                {question.rows.map((row, index) => (
                  <tr key={index}>
                    <td style={styles.cell}>{row.left}</td>
                    <td style={styles.cell}>{row.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
                    ...(isSelected ? styles.choiceButtonSelected : {}),
                  }}
                >
                  {alternative.label}
                </button>
              )
            })}
          </div>
        </div>

      </section>

      <section style={styles.bottomBar}>
        <div style={styles.separator} />

        <div style={styles.inner}>
          <div style={styles.bottomBarInner}>

            <button
              type="button"
              onClick={handleCheck}
              disabled={!selectedAlternativeId}
              style={{
                ...styles.primaryButton,
                ...(selectedAlternativeId ? {} : styles.primaryButtonDisabled),
              }}
            >
              Check
            </button>
          </div>

        </div>
      </section>
    </main>
  )
}

const styles = {
  main: {
    minHeight: "100vh",
    width: "100%",              // 👈 full width
    padding: "24px 0 20px",    // 👈 remove horizontal padding here
    display: "flex",
    flexDirection: "column" as const,
    boxSizing: "border-box" as const,
    color: "inherit",
  },
  inner: {
    width: "100%",
    maxWidth: "980px",
    margin: "0 auto",
    padding: "0 32px",
    boxSizing: "border-box" as const,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    paddingTop: "88px",
  },
  centeredState: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBlock: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto 20px",
  },
  promptTitle: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.15,
    fontWeight: 600,
    color: "#24364d",
    textAlign: "left" as const,
  },
  expression: {
    margin: "0 0 44px",
    fontSize: "56px",
    lineHeight: 1.05,
    fontWeight: 700,
    color: "#24364d",
    textAlign: "center" as const,
  },
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
    gap: "16px",
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  },
  choiceButton: {
    minHeight: "64px",
    padding: "16px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    color: "#111827",
    background: "white",
    border: "1px solid #d1d5db",
    fontSize: "28px",
    fontWeight: 600,
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  },
  choiceButtonSelected: {
    border: "2px solid #7cc9ff",
    background: "#eef8ff",
  },
  bottomBar: {
    width: "100%",
    marginTop: "auto",
    paddingTop: "28px",
    paddingBottom: "32px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "stretch",
    backgroundColor: "#ffffff", // 👈 subtle surface
  },
  separator: {
    width: "100%",
    height: "1px",
    backgroundColor: "#e5e7eb",
    marginBottom: "20px",
    boxShadow: "0 -1px 0 rgba(0,0,0,0.02)",
  },
  bottomBarInner: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  primaryButton: {
    minWidth: "180px",
    minHeight: "56px",
    padding: "14px 28px",
    border: "none",
    borderRadius: "14px",
    background: "#58cc02",
    color: "white",
    fontSize: "22px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 0 #46a302",
  },
  primaryButtonDisabled: {
    background: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  statusTitle: {
    margin: "0 0 16px",
    fontSize: "28px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#24364d",
    textAlign: "center" as const,
  },
  feedbackPanelCorrect: {
    maxWidth: "560px",
    margin: "0 auto 24px",
    padding: "24px",
    borderRadius: "16px",
    background: "#ecfccb",
    border: "1px solid #bef264",
  },
  feedbackPanelNotQuite: {
    maxWidth: "560px",
    margin: "0 auto 24px",
    padding: "24px",
    borderRadius: "16px",
    background: "#fef3c7",
    border: "1px solid #fcd34d",
  },
  feedbackTitle: {
    margin: "0 0 12px",
    fontSize: "30px",
    lineHeight: 1.2,
    fontWeight: 700,
    color: "#24364d",
    textAlign: "center" as const,
  },
  feedbackText: {
    margin: 0,
    fontSize: "22px",
    lineHeight: 1.4,
    color: "#374151",
    textAlign: "center" as const,
  },
  action: {
    color: "#1cb0f6",
    fontWeight: 700,
  },
  table: {
    margin: "0 auto 32px",
    borderCollapse: "collapse" as const,
  },

  cell: {
    padding: "12px 24px",
    border: "1px solid #e5e7eb",
    fontSize: "24px",
    fontWeight: 600,
    textAlign: "center" as const,
  },
}