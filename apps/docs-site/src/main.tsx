/** @jsxImportSource react */
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { ButtonPage } from './pages/Components/ButtonPage'
import { HomePage } from './pages/HomePage'

createRoot(document.getElementById('root')!).render(
  // Note: StrictMode disabled because Phaser Game instances don't play well
  // with React's double-mount behavior in development
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/components/button" element={<ButtonPage />} />
    </Routes>
  </BrowserRouter>
)
