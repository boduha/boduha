import { Routes, Route } from 'react-router-dom'
import QuestionPage from './QuestionPage'

export default function BoduhaApp() {
  return (
    <Routes>
      <Route path="/" element={<QuestionPage />} />
    </Routes>
  )
}