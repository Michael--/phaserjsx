/** @jsxImportSource react */
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ComponentPage } from './components/ComponentPage'
import { buttonContent } from './content/button.content'
import { chartextContent } from './content/chartext.content'
import { chartextinputContent } from './content/chartextinput.content'
import { dividerContent } from './content/divider.content'
import { dropdownContent } from './content/dropdown.content'
import { portalContent } from './content/portal.content'
import { radiobuttonContent } from './content/radiobutton.content'
import { scrollviewContent } from './content/scrollview.content'
import { sliderContent } from './content/slider.content'
import { textContent } from './content/text.content'
import { toggleContent } from './content/toggle.content'
import { viewContent } from './content/view.content'
import { wraptextContent } from './content/wraptext.content'
import './index.css'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { BestPracticesPage, SceneBackgroundsPage, TestingPage } from './pages/Guides'
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
      <Route path="/components/button" element={<ComponentPage content={buttonContent} />} />
      <Route path="/components/toggle" element={<ComponentPage content={toggleContent} />} />
      <Route path="/components/slider" element={<ComponentPage content={sliderContent} />} />
      <Route
        path="/components/radiobutton"
        element={<ComponentPage content={radiobuttonContent} />}
      />
      <Route path="/components/dropdown" element={<ComponentPage content={dropdownContent} />} />
      <Route
        path="/components/view"
        element={
          <ComponentPage
            content={viewContent}
            infoBox={
              <div className="info-box">
                <strong>Important:</strong> An empty View without a background color is invisible.
                Always add either a <code>backgroundColor</code> or child content to make your Views
                visible.
              </div>
            }
          />
        }
      />
      <Route
        path="/components/scroll-view"
        element={<ComponentPage content={scrollviewContent} />}
      />
      <Route path="/components/divider" element={<ComponentPage content={dividerContent} />} />
      <Route path="/components/portal" element={<ComponentPage content={portalContent} />} />

      {/* Guides */}
      <Route path="/guides/best-practices" element={<BestPracticesPage />} />
      <Route path="/guides/testing" element={<TestingPage />} />
      <Route path="/guides/scene-backgrounds" element={<SceneBackgroundsPage />} />

      <Route path="/components/text" element={<ComponentPage content={textContent} />} />
      <Route path="/components/wraptext" element={<ComponentPage content={wraptextContent} />} />
      <Route path="/components/chartext" element={<ComponentPage content={chartextContent} />} />
      <Route
        path="/components/chartextinput"
        element={<ComponentPage content={chartextinputContent} />}
      />

      {/* Placeholder routes */}
      <Route path="/components/image" element={<ComingSoonPage />} />
      <Route path="/components/icon" element={<ComingSoonPage />} />
      <Route path="/components/*" element={<ComingSoonPage />} />
      <Route path="/guides/*" element={<ComingSoonPage />} />
      <Route path="*" element={<ComingSoonPage />} />
    </Routes>
  </BrowserRouter>
)
