/** @jsxImportSource react */
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ButtonPage } from './pages/Components/ButtonPage'
import { TogglePage } from './pages/Components/TogglePage'
import { ViewPage } from './pages/Components/ViewPage'
import { SceneBackgroundsPage, TestingPage } from './pages/Guides'
import { HomePage } from './pages/HomePage'
import { InstallationPage } from './pages/InstallationPage'
import { IntroductionPage } from './pages/IntroductionPage'

createRoot(document.getElementById('root')!).render(
  // Note: StrictMode disabled because Phaser Game instances don't play well
  // with React's double-mount behavior in development
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/introduction" element={<IntroductionPage />} />
      <Route path="/installation" element={<InstallationPage />} />
      <Route path="/components/button" element={<ButtonPage />} />
      <Route path="/components/toggle" element={<TogglePage />} />
      <Route path="/components/view" element={<ViewPage />} />

      {/* Guides */}
      <Route path="/guides/testing" element={<TestingPage />} />
      <Route path="/guides/scene-backgrounds" element={<SceneBackgroundsPage />} />

      {/* Placeholder routes */}
      <Route path="/components/text" element={<ComingSoonPage />} />
      <Route path="/components/image" element={<ComingSoonPage />} />
      <Route path="/components/icon" element={<ComingSoonPage />} />
      <Route path="/components/*" element={<ComingSoonPage />} />
      <Route path="/guides/*" element={<ComingSoonPage />} />
      <Route path="*" element={<ComingSoonPage />} />
    </Routes>
  </BrowserRouter>
)
