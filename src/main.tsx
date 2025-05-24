import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import YupApp from './app/app-yup'
import ZodApp from './app/app-zod'
import JoiApp from './app/app-joi'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YupApp />
    <ZodApp />
    <JoiApp />
  </StrictMode>,
)