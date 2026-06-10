/** @jsxImportSource react */
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  // Note: StrictMode disabled because Phaser Game instances don't play well
  // with React's double-mount behavior in development
  <App />
)
