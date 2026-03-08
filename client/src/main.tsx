import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BoduhaApp from './BoduhaApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoduhaApp />
  </StrictMode>,
)
