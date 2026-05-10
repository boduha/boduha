import type { Question, AnswerSubmission, AnswerResult } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

export async function getNextQuestion(): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/question`, { credentials: "include" })

  if (!response.ok) {
    throw new Error(`Failed to load question: ${response.status}`)
  }

  return response.json()
}

export async function submitAnswer(
  questionId: number,
  submission: AnswerSubmission
): Promise<AnswerResult> {
  const response = await fetch(`${API_BASE_URL}/question/${questionId}/answer`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  })

  if (!response.ok) {
    throw new Error(`Failed to validate answer: ${response.status}`)
  }

  return response.json()
}