import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@epam/uui-components/styles.css'
import '@epam/uui/styles.css'
import '@epam/promo/styles.css'
import '@epam/assets/theme/theme_promo.scss'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
