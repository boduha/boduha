import { useEffect, useMemo, useRef, useState } from "react"
import Button from "@mui/material/Button"
import ActionButton from "./components/ActionButton"
import { useTheme } from "@mui/material/styles"
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

function hideStartupSplash() {
  const splash = document.getElementById("startup-splash")
  if (!splash) return

  splash.classList.add("fade-out")

  window.setTimeout(() => {
    splash.remove()
  }, 320)
}

function getFeedbackMessage(question: Question, answerResult: AnswerResult) {
  switch (question.type) {
    case "PLAIN":
      return (
        <>
          {question.value}
          <sub style={{ fontSize: "8px" }}>10</sub> in binary is{" "}
          <strong>
            {answerResult.correctAlternative.label}
            <sub style={{ fontSize: "8px" }}>2</sub>
          </strong>
          .
        </>
      )

    case "PARITY": {
      const binary = question.rows?.[0]?.right ?? ""
      const parity = answerResult.correctAlternative.label
      const ending = parity.toLowerCase() === "even" ? "0" : "1"

      return (
        <>
          {binary}
          <sub style={{ fontSize: "8px" }}>2</sub> is <strong>{parity}</strong>{" "}
          because it ends in {ending}.
        </>
      )
    }

    case "TABLE":
      const value = question.rows?.[2]?.left ?? ""

      return (
        <>

          {value}
          <sub style={{ fontSize: "8px" }}>10</sub> in binary is{" "}
          <strong>
            {answerResult.correctAlternative.label}
            <sub style={{ fontSize: "8px" }}>2</sub>
          </strong>
          .
        </>
      )

    default:
      return null
  }
}
export default function QuestionPage() {
  const theme = useTheme()
  const isDark = theme.palette.mode === "dark"

  const palette = useMemo(
    () => ({
      pageBackground: isDark ? "#001c2d" : "#ffffff",
      primaryText: isDark ? "#f7f7f7" : "#3c3c3c",
      secondaryText: isDark ? "#a7b4c0" : "#6b7280",
      accentBlue: isDark ? "#6ccfff" : "#1cb0f6",
      line: isDark ? "#29485a" : "#e5e7eb",
      choiceBg: isDark ? "#082131" : "#ffffff",
      choiceBorder: isDark ? "#3a5568" : "#d7d7d7",
      choiceText: isDark ? "#f7f7f7" : "#4b4b4b",
      choiceSelectedBg: isDark ? "#1f7ae0" : "#ddf4ff",
      choiceSelectedBorder: isDark ? "#1f7ae0" : "#84d8ff",
      choiceSelectedText: isDark ? "#ffffff" : "#1d4f73",
      successBg: "#58cc02",
      successShadow: "#46a302",
      successText: isDark ? "#163300" : "#ffffff",
      disabledBg: isDark ? "#31414d" : "#e5e7eb",
      disabledText: isDark ? "#7f8c97" : "#9ca3af",
      warningPanelBg: isDark ? "#3a2a12" : "#fef3c7",
      warningPanelBorder: isDark ? "#8b6b2e" : "#fcd34d",
      warningTitle: isDark ? "#ffd76a" : "#8a5a00",
      successTitle: isDark ? "#89e219" : "#46a302",
      tableBorder: isDark ? "#3a5568" : "#e5e7eb",
    }),
    [isDark],
  )

  const styles = useMemo(
    () => ({
      main: {
        minHeight: "100dvh",
        width: "100%",
        padding: "8px 0 20px",
        display: "flex",
        flexDirection: "column" as const,
        boxSizing: "border-box" as const,
        color: palette.primaryText,
        backgroundColor: palette.pageBackground,
        position: "relative" as const,
      },
      content: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        paddingTop: "20px",
      },
      inner: {
        width: "100%",
        maxWidth: "980px",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box" as const,
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
        margin: "0 auto 12px",
      },
      expression: {
        margin: "0 0 28px",
        fontSize: "56px",
        lineHeight: 1.05,
        fontWeight: 700,
        color: palette.primaryText,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      promptTitle: {
        margin: 0,
        fontSize: "30px",
        lineHeight: 1.15,
        fontWeight: 700,
        color: palette.primaryText,
        textAlign: "left" as const,
        fontFamily: "Buenard, serif",
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
      },
      separator: {
        width: "100%",
        height: "2px",
        backgroundColor: palette.line,
        marginBottom: "20px",
        marginTop: "32px",
      },
      bottomBarInner: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
      },
      statusTitle: {
        margin: "0 0 16px",
        fontSize: "28px",
        lineHeight: 1.2,
        fontWeight: 700,
        color: palette.primaryText,
        textAlign: "center" as const,
      },
      feedbackPanelNotQuite: {
        maxWidth: "560px",
        margin: "0 auto 24px",
        padding: "24px",
        borderRadius: "16px",
        background: palette.warningPanelBg,
        border: `1px solid ${palette.warningPanelBorder}`,
      },
      feedbackTitle: {
        margin: "0 0 12px",
        fontSize: "30px",
        lineHeight: 1.2,
        fontWeight: 800,
        color: palette.successTitle,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      feedbackTitleWarning: {
        margin: "0 0 12px",
        fontSize: "30px",
        lineHeight: 1.2,
        fontWeight: 800,
        color: palette.warningTitle,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      feedbackText: {
        margin: 0,
        fontSize: "22px",
        lineHeight: 1.4,
        color: palette.primaryText,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      action: {
        color: palette.accentBlue,
        fontWeight: 800,
      },
      table: {
        margin: "0 auto 32px",
        borderCollapse: "collapse" as const,
        fontFamily: "Buenard, serif",
        borderTop: `2px solid ${palette.tableBorder}`,
      },
      cell: {
        padding: "12px 24px",
        border: "none",
        fontSize: "24px",
        fontWeight: 600,
        textAlign: "center" as const,
        color: palette.primaryText,
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
        color: palette.secondaryText,
      },

      sessionCompleteWrap: {
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
      },
      sessionScoreFraction: {
        margin: "8px 0 0",
        fontSize: "36px",
        lineHeight: 1.1,
        fontWeight: 800,
        color: palette.primaryText,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      sessionScorePercent: {
        margin: "8px 0 12px",
        fontSize: "72px",
        lineHeight: 1,
        fontWeight: 800,
        color: palette.accentBlue,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      sessionSupportText: {
        margin: 0,
        fontSize: "20px",
        lineHeight: 1.4,
        color: palette.secondaryText,
        textAlign: "center" as const,
        fontFamily: "Buenard, serif",
      },
      sessionRestartWrap: {
        marginTop: "28px",
      },
    }),
    [palette],
  )

  const [question, setQuestion] = useState<Question | null>(null)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [streak, setStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const SESSION_LENGTH = 8
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
const continueRef = useRef<HTMLButtonElement | null>(null)

  const successPercentage =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0

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
  if (screenState === "correct" || screenState === "notQuite") {
    continueRef.current?.focus()
  }
}, [screenState])

  useEffect(() => {
    if (screenState !== "question" || !question) return

    function handleKeyDown(event: KeyboardEvent) {
      const alternatives = question.alternatives
      if (alternatives.length === 0) return

      const currentIndex = Math.max(
        0,
        alternatives.findIndex((a) => a.id === selectedAlternativeId),
      )

      const moveTo = (nextIndex: number) => {
        const safeIndex = (nextIndex + alternatives.length) % alternatives.length
        setSelectedAlternativeId(alternatives[safeIndex].id)
        optionRefs.current[safeIndex]?.focus()
      }

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "s":
        case "S":
        case "d":
        case "D":
          event.preventDefault()
          moveTo(currentIndex + 1)
          break

        case "ArrowUp":
        case "ArrowLeft":
        case "w":
        case "W":
        case "a":
        case "A":
          event.preventDefault()
          moveTo(currentIndex - 1)
          break

case "1":
case "2":
case "3":
case "4": {
  const index = Number(event.key) - 1
  if (alternatives[index]) {
    event.preventDefault()
    setSelectedAlternativeId(alternatives[index].id)
    optionRefs.current[index]?.focus()
  }
  break
}

        case "Enter":
        case " ": {
          if (selectedAlternativeId) {
            event.preventDefault()
            void handleCheck()
          }
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [question, selectedAlternativeId, screenState])

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
      } finally {
        if (cancelled) return
        requestAnimationFrame(() => {
          if (cancelled) return
          hideStartupSplash()
        })
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
      const clickSound = new Audio("/sounds/tap.mp3")
      clickSound.currentTime = 0
      void clickSound.play()

      const result = await submitAnswer(question.id, submission)
      setAnswerResult(result)

      if (result.correct) {
        setStreak((current) => current + 1)
        setCorrectCount((current) => current + 1)
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
    const clickSound = new Audio("/sounds/tap.mp3")
    clickSound.currentTime = 0
    void clickSound.play()
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

  if (screenState === "sessionComplete") {
    return (
      <main style={styles.main}>
        <section style={styles.centeredState}>
          <div style={styles.sessionCompleteWrap}>
            <h1 style={styles.feedbackTitle}>Session complete!</h1>

            <p style={styles.sessionScoreFraction}>
              {correctCount}/{SESSION_LENGTH} correct answers
            </p>

            <p style={styles.sessionScorePercent}>{successPercentage}%</p>

            <p style={styles.sessionSupportText}>
              {successPercentage === 100
                ? "Perfect. No errors."
                : successPercentage >= 90
                  ? "Almost perfect."
                  : successPercentage >= 70
                    ? "Good. A few mistakes."
                    : successPercentage >= 50
                      ? "Some gaps. Practice helps."
                      : "Needs practice."}
            </p>

            <div style={styles.sessionRestartWrap}>
              <ActionButton
                onClick={async () => {
                  const clickSound = new Audio("/sounds/tap.mp3")
                  clickSound.currentTime = 0
                  void clickSound.play()
                  setAnsweredCount(0)
                  setCorrectCount(0)
                  setStreak(0)
                  setSelectedAlternativeId(null)
                  setAnswerResult(null)
                  setErrorMessage(null)
                  setScreenState("loading")
                  await loadQuestion()
                }}
              >
                Restart
              </ActionButton>
            </div>
          </div>
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
            <h1 id="question-title" style={styles.promptTitle}>
              <span style={styles.action}>{ac}</span> {rest}
            </h1>
            <p id="question-help" style={styles.progressText}>
              Use Tab or arrow keys to choose an answer, then Enter to check.
            </p>
          </div>

          {question.type === "PLAIN" && <p style={styles.expression}>{question.value} = ?</p>}
          {question.type === "PARITY" && <p style={styles.expression}>Binary: {question.rows[0].right}</p>}

          {question.type === "TABLE" && question.rows && (
            <table style={styles.table}>
              <tbody>
                {question.rows.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderTop: `1px solid ${palette.tableBorder}`,
                      borderBottom: `1px solid ${palette.tableBorder}`,
                    }}
                  >
                    <td style={styles.cell}>{row.left}</td>
                    <td
                      style={{
                        ...styles.cell,
                        borderLeft: `1px solid ${palette.tableBorder}`,
                      }}
                    >
                      {row.right}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div
            role="radiogroup"
            aria-labelledby="question-title"
            aria-describedby="question-help"
            style={styles.choicesGrid}
          >
            {question.alternatives.map((alternative, index) => {
              const isSelected = selectedAlternativeId === alternative.id

              return (
                <Button
                  ref={(element) => {
                    optionRefs.current[index] = element
                  }}
                  key={alternative.id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={
                    selectedAlternativeId
                      ? isSelected
                        ? 0
                        : -1
                      : index === 0
                        ? 0
                        : -1
                  }
                  disableRipple
                  disableFocusRipple
                  fullWidth

                  onClick={() => {
                    const clickSound = new Audio("/sounds/tap.mp3")
                    clickSound.currentTime = 0
                    void clickSound.play()
                    setSelectedAlternativeId(alternative.id)
                  }}

                  sx={{
                    height: "64px",
                    fontSize: "1.5rem",
                    borderRadius: "16px",
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: isSelected ? palette.choiceSelectedBg : palette.choiceBg,
                    color: isSelected ? palette.choiceSelectedText : palette.choiceText,
                    border: `2px solid ${isSelected ? palette.choiceSelectedBorder : palette.choiceBorder
                      }`,
                    "&:hover": {
                      backgroundColor: isSelected ? palette.choiceSelectedBg : palette.choiceBg,
                      boxShadow: "none",
                    },
                    "&:focus-visible": {
                      outline: `4px solid ${palette.accentBlue}`,
                      outlineOffset: "2px",
                    },
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
          <div style={styles.inner} aria-live="polite" aria-atomic="true">
            <h1 style={styles.feedbackTitle}>Correct!</h1>
            <p style={styles.feedbackText}>
              {answerResult ? getFeedbackMessage(question, answerResult) : null}
            </p>
            <div style={styles.separator} />
            <div style={styles.bottomBarInner}>
<ActionButton ref={continueRef} onClick={handleContinue}>
  Continue
</ActionButton>
            </div>
          </div>
        )}

        {screenState === "notQuite" && (
          <div style={styles.inner} aria-live="polite" aria-atomic="true">
            <h1 style={styles.feedbackTitleWarning}>Not quite!</h1>
            <p style={styles.feedbackText}>
              {answerResult ? getFeedbackMessage(question, answerResult) : null}
            </p>
            <div style={styles.separator} />
            <div style={styles.bottomBarInner}>
<ActionButton ref={continueRef} onClick={handleContinue}>
  Continue
</ActionButton>
            </div>
          </div>
        )}

        {screenState === "question" && (
          <div style={styles.inner}>
            <div style={styles.separator} />
            <div style={styles.bottomBarInner}>
              <ActionButton onClick={handleCheck} disabled={!selectedAlternativeId}>
                Check
              </ActionButton>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}