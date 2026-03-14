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

const correctAnswer = "101010"

type ScreenState = "question" | "correct" | "wrong"

export default function Question42() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>("question")

  function handleVerify() {
    if (!selectedAnswer) return

    if (selectedAnswer === correctAnswer) {
      setScreenState("correct")
    } else {
      setScreenState("wrong")
    }
  }

  if (screenState === "correct") {
    return (
      <main>
        <h1>Correct!</h1>
        <p>42 in binary is 101010.</p>
      </main>
    )
  }

  if (screenState === "wrong") {
    return (
      <main>
        <h1>Not quite!</h1>
        <p>Your answer was not correct.</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Question</h1>
      <p>Convert 42 (decimal) to binary:</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
          gap: "12px",
          maxWidth: "480px",
          margin: "0 auto 16px",
        }}
      >
        {choices.map((choice) => {
          const isSelected = selectedAnswer === choice.label

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => setSelectedAnswer(choice.label)}
              style={{
                padding: "12px",
                border: isSelected ? "2px solid black" : "1px solid #ccc",
                borderRadius: "8px",
                background: isSelected ? "#f0f0f0" : "white",
                cursor: "pointer",
              }}
            >
              {choice.label}
            </button>
          )
        })}
      </div>

      <button type="button" onClick={handleVerify} disabled={!selectedAnswer}>
        Verify
      </button>
    </main>
  )
}