import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/app-zod'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)