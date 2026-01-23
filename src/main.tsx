import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

function PrerenderReady({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Signal to prerenderer that the page is ready after React has rendered
    document.dispatchEvent(new Event('prerender-ready'))
  }, [])
  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrerenderReady>
        <App />
      </PrerenderReady>
    </BrowserRouter>
  </React.StrictMode>,
)
