import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { Authprovider } from './Context/Auth'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Authprovider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </Authprovider>
  </React.StrictMode>
)
