export type Alternative = {
  id: string
  label: string
}

export type Question = {
  id: number
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