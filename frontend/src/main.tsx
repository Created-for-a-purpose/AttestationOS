import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { WalletProvider } from './context/WalletContext.tsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NextUIProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
)