import './BoduhaApp.css'
import { Routes, Route } from 'react-router-dom'
import Question from './Question'

export default function BoduhaApp() {
  return (
    <Routes>
      <Route path="/" element={<Question />} />
    </Routes>
  )
}