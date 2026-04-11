import { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import { getNextQuestion, submitAnswer } from "./questionApi"

import { logger } from "./logger"

import type { AnswerResult, AnswerSubmission, Question } from "./types"

type ScreenState =
  | "loading"
  | "question"
  | "correct"
  | "notQuite"
  | "error"
  | "sessionComplete"

export default function Question() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [streak, setStreak] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const SESSION_LENGTH = 8

  async function loadQuestion() {
    try {
      logger.debug("[BODUHA][CLIENT] Loading question")

      const data: Question = await getNextQuestion()

      logger.debug("[BODUHA][CLIENT] Received question:", data)

      setQuestion(data)
      setSelectedAlternativeId(null)
      setErrorMessage(null)
      setAnswerResult(null)
      setScreenState("question")
    } catch (error) {
      logger.error("Error loading question", error)
      setErrorMessage("Could not load question.")
      setScreenState("error")
    }
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitialQuestion() {
      try {
        logger.debug("[BODUHA][CLIENT] Loading question")

        const data: Question = await getNextQuestion()

        if (cancelled) return

        logger.debug("[BODUHA][CLIENT] Received question:", data)

        setQuestion(data)
        setSelectedAlternativeId(null)
        setErrorMessage(null)
        setAnswerResult(null)
        setScreenState("question")
      } catch (error) {
        if (cancelled) return

        logger.error("Error loading question", error)
        setErrorMessage("Could not load question.")
        setScreenState("error")
      }
    }

    void loadInitialQuestion()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleCheck() {
    if (!selectedAlternativeId || !question) return

    try {
      const submission: AnswerSubmission = { answer: selectedAlternativeId }

      const result = await submitAnswer(question.id, submission)
      setAnswerResult(result)
      if (result.correct) {
        setStreak((current) => current + 1)
      } else {
        setStreak(0)
      }
      setAnsweredCount((current) => current + 1)
      setScreenState(result.correct ? "correct" : "notQuite")
    } catch (error) {
      logger.error("Error validating answer", error)
      setErrorMessage("Could not validate answer.")
      setScreenState("error")
    }
  }

  async function handleContinue() {
    if (answeredCount >= SESSION_LENGTH) {
      setScreenState("sessionComplete")
      return
    }

    setScreenState("loading")
    await loadQuestion()
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

  if (screenState === "notQuite") {
    return (
      <main style={styles.main}>
        <section style={styles.centeredState}>
          <div style={styles.feedbackPanelNotQuite}>
            <h1 style={styles.feedbackTitle}>Not quite!</h1>
            <p style={styles.feedbackText}>
              {question.value}<sub style={{ fontSize: "8px" }}>10</sub> in binary is <strong>{answerResult?.correctAlternative.label}<sub style={{ fontSize: "8px" }}>2</sub></strong>.
            </p>
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
  if (screenState === "sessionComplete") {
    return (
      <main style={styles.main}>
        <section style={styles.centeredState}>
          <h1 style={styles.feedbackTitle}>Session complete!</h1>
          <p style={styles.feedbackText}>
            You answered {SESSION_LENGTH} questions.
          </p>
          <button
            type="button"
            onClick={async () => {
              setAnsweredCount(0)
              setStreak(0)
              setSelectedAlternativeId(null)
              setAnswerResult(null)
              setErrorMessage(null)
              setScreenState("loading")
              await loadQuestion()
            }}
            style={styles.primaryButton}
          >
            Restart
          </button>
        </section>
      </main>
    )
  }
  const [ac, ...restParts] = question.statement.split(" ")
  const rest = restParts.join(" ")

  return (
    <main style={styles.main}>

      <section style={styles.content}>
        <div style={styles.inner}>
          <div style={styles.progressRow}>
            <p style={styles.progressText}>Answered: {answeredCount}</p>
            <p style={styles.progressText}>Streak: {streak}</p>
          </div>

          <div style={styles.headerBlock}>
            <h1 style={styles.promptTitle}>
              <span style={styles.action}>{ac}</span> {rest}
            </h1>
          </div>

          {question.type === "PLAIN" && (
            <p style={styles.expression}>{question.value} = ?</p>
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
                <Button
                  disableRipple
                  disableFocusRipple
                  key={alternative.id}
                  variant={isSelected ? "contained" : "outlined"}
                  color={isSelected ? "primary" : "inherit"}

                  fullWidth
                  //onClick={() => setSelectedAlternativeId(alternative.id)}
                  onClick={() => {
                    const clickSound = new Audio("/sounds/tap.mp3")

                    clickSound.currentTime = 0
                    clickSound.play()
                    setSelectedAlternativeId(alternative.id)
                  }}
                  sx={{
                    height: "64px",
                    fontSize: "1.5rem",
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: isSelected ? 3 : 1,
                  }}
                >
                  {alternative.label}
                </Button>
              )
            })}
          </div>
        </div>

      </section>

      <section style={styles.bottomBar}>


        {screenState === "correct" && (
          <div style={styles.inner}>
            <h1 style={styles.feedbackTitle}>Correct!</h1>
            <p style={styles.feedbackText}>
              {question.value}
              <sub style={{ fontSize: "8px" }}>10</sub>
              {" "}in binary is{" "}
              <strong>
                {answerResult.correctAlternative.label}
                <sub style={{ fontSize: "8px" }}>2</sub>
              </strong>.
            </p>
            <div style={styles.separator} />
            <div style={styles.bottomBarInner}>

              <Button onClick={handleContinue}
                style={styles.primaryButton}
              >
                Continue
              </Button>
            </div>

          </div>
        )}

        {screenState === "question" && (
          <div style={styles.inner}>
            <div style={styles.separator} />
            <div style={styles.bottomBarInner}>

              <Button
                onClick={handleCheck}
                disabled={!selectedAlternativeId}
                style={{
                  ...styles.primaryButton,
                  ...(selectedAlternativeId ? {} : styles.primaryButtonDisabled),
                }}
              >
                Check
              </Button>
            </div>
          </div>
        )}


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
    position: "relative",
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
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  },
  bottomBar: {
    width: "100%",
    marginTop: "auto",
    paddingTop: "28px",
    paddingBottom: "32px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "stretch",
    //backgroundColor: "#ffffff", // 👈 subtle surface
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
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none", // allows background to stay visible
  },
  progressRow: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#24364d",
  },
}