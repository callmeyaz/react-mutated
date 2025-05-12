import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/app-joi'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)