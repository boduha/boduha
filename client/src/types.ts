export type Alternative = {
  id: string
  label: string
}

export type QuestionType = "CONVERT" | "TABLE"

export type Question = {
  id: number
  type: QuestionType
  statement: string
  alternatives: Alternative[]
}

export type AnswerSubmission = {
  answer: string
}

export type AnswerResult = {
  questionId: number
  selected: string
  correct: boolean
}