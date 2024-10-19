import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {Toaster} from 'react-hot-toast'

import {AppContextProvider} from './contexts/AppContext'
import App from './App.tsx'
import './index.css'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0
    }
  }
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Toaster />
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
