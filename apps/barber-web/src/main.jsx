import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/literata/400.css'
import '@fontsource/literata/600.css'
import '@fontsource/literata/700.css'
import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/600.css'
import '@fontsource/nunito-sans/700.css'
import './index.css'
import './i18n.js'
import { TerraThemeProvider } from '@/theme/ThemeContext'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider>
      <TerraThemeProvider>
        <CssBaseline />
        <App />
      </TerraThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
