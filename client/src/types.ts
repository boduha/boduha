export type Alternative = {
  id: string
  label: string
}

export type TableRow = {
  left: string
  right: string
}
export type QuestionType = "PLAIN" | "TABLE"

export type Question = {
  id: number
  value: number
  type: QuestionType
  statement: string
  alternatives: Alternative[]
  rows: TableRow[] | null
}

export type AnswerSubmission = {
  answer: string
}

export type AnswerResult = {
  questionId: number
  selected: string
  correct: boolean
  correctAlternative : Alternative
}