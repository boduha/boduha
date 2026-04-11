import type { Question, AnswerSubmission, AnswerResult } from "./types"

export async function getNextQuestion(): Promise<Question> {
  const response = await fetch(`/question`)

  if (!response.ok) {
    throw new Error(`Failed to load question: ${response.status}`)
  }

  return response.json()
}

export async function submitAnswer(
  questionId: string,
  submission: AnswerSubmission
): Promise<AnswerResult> {
  const response = await fetch(`/question/${questionId}/answer`, {
    method: "POST",
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