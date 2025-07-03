import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UuiContext, StubAdaptedRouter, useUuiServices } from '@epam/uui-core'
import '@epam/uui-components/styles.css'
import '@epam/uui/styles.css'
import '@epam/promo/styles.css'
import '@epam/assets/theme/theme_promo.scss'
import './index.css'
import App from './App.jsx'

// eslint-disable-next-line react-refresh/only-export-components
function UuiProvider({ children }) {
  const { services } = useUuiServices({ router: new StubAdaptedRouter() })
  return <UuiContext.Provider value={services}>{children}</UuiContext.Provider>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UuiProvider>
      <App />
    </UuiProvider>
  </StrictMode>,
)
