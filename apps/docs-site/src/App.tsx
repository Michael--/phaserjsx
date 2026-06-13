/** @jsxImportSource react */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ComponentPage } from './components/ComponentPage'
import { DocsThemeProvider } from './components/Layout'
import { accordionContent } from './content/accordion.content'
import { activityIndicatorContent } from './content/activity-indicator.content'
import { alertdialogContent } from './content/alertdialog.content'
import { badgeContent } from './content/badge.content'
import { bottomSheetContent } from './content/bottom-sheet.content'
import { buttonContent } from './content/button.content'
import { chartextContent } from './content/chartext.content'
import { chartextinputContent } from './content/chartextinput.content'
import { checkboxContent } from './content/checkbox.content'
import { colorPickerContent } from './content/colorpicker.content'
import { dialogContent } from './content/dialog.content'
import { dividerContent } from './content/divider.content'
import { dropdownContent } from './content/dropdown.content'
import { graphicsContent } from './content/graphics.content'
import { iconContent } from './content/icon.content'
import { imageContent } from './content/image.content'
import { joystickContent } from './content/joystick.content'
import { listboxContent } from './content/listbox.content'
import { menuButtonContent } from './content/menu-button.content'
import { modalContent } from './content/modal.content'
import { nineSliceButtonContent } from './content/nine-slice-button.content'
import { numberInputContent } from './content/number-input.content'
import { palettePickerContent } from './content/palette-picker.content'
import { particlesContent } from './content/particles.content'
import { popoverContent } from './content/popover.content'
import { portalContent } from './content/portal.content'
import { progressViewContent } from './content/progress-view.content'
import { progressbarContent } from './content/progressbar.content'
import { radiobuttonContent } from './content/radiobutton.content'
import { ratingBarContent } from './content/rating-bar.content'
import { refOriginViewContent } from './content/ref-origin-view.content'
import { scrollviewContent } from './content/scrollview.content'
import { segmentedControlContent } from './content/segmented-control.content'
import { sliderContent } from './content/slider.content'
import { spriteContent } from './content/sprite.content'
import { tabsContent } from './content/tabs.content'
import { textContent } from './content/text.content'
import { tileSpriteContent } from './content/tilesprite.content'
import { toastContent } from './content/toast.content'
import { toggleContent } from './content/toggle.content'
import { toolbarContent } from './content/toolbar.content'
import { transformOriginViewContent } from './content/transform-origin-view.content'
import { viewContent } from './content/view.content'
import { wheelPickerContent } from './content/wheel-picker.content'
import { wraptextContent } from './content/wraptext.content'
import { CorePropsApiPage } from './pages/ApiReference/CorePropsApiPage'
import { EffectRegistryApiPage } from './pages/ApiReference/EffectRegistryApiPage'
import { HooksApiPage } from './pages/ApiReference/HooksApiPage'
import { ThemeTypesApiPage } from './pages/ApiReference/ThemeTypesApiPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import {
  BestPracticesPage,
  CustomIconComponentPage,
  CustomSvgIconsPage,
  IconGeneratorConfigPage,
  IconSystemPage,
  PhaserJsxPluginPage,
  SceneBackgroundsPage,
  TestingPage,
  TooltipsPage,
} from './pages/Guides'
import { EffectsPage } from './pages/Guides/EffectsPage'
import { GesturesPage } from './pages/Guides/GesturesPage'
import { LayoutPatternsPage } from './pages/Guides/LayoutPatternsPage'
import { PerformancePage } from './pages/Guides/PerformancePage'
import { ResponsiveDesignPage } from './pages/Guides/ResponsiveDesignPage'
import { ThemeSystemPage } from './pages/Guides/ThemeSystemPage'
import { HomePage } from './pages/HomePage'
import { InstallationPage } from './pages/InstallationPage'
import { IntroductionPage } from './pages/IntroductionPage'
import { QuickStartPage } from './pages/QuickStartPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function App() {
  return (
    <DocsThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/installation" element={<InstallationPage />} />
          <Route path="/quick-start" element={<QuickStartPage />} />
          <Route path="/components/button" element={<ComponentPage content={buttonContent} />} />
          <Route
            path="/components/checkbox"
            element={<ComponentPage content={checkboxContent} />}
          />
          <Route path="/components/toggle" element={<ComponentPage content={toggleContent} />} />
          <Route path="/components/slider" element={<ComponentPage content={sliderContent} />} />
          <Route
            path="/components/colorpicker"
            element={<ComponentPage content={colorPickerContent} />}
          />
          <Route
            path="/components/progressbar"
            element={<ComponentPage content={progressbarContent} />}
          />
          <Route
            path="/components/progress-view"
            element={<ComponentPage content={progressViewContent} />}
          />
          <Route
            path="/components/number-input"
            element={<ComponentPage content={numberInputContent} />}
          />
          <Route
            path="/components/segmented-control"
            element={<ComponentPage content={segmentedControlContent} />}
          />
          <Route
            path="/components/palette-picker"
            element={<ComponentPage content={palettePickerContent} />}
          />
          <Route path="/components/toolbar" element={<ComponentPage content={toolbarContent} />} />
          <Route
            path="/components/menu-button"
            element={<ComponentPage content={menuButtonContent} />}
          />
          <Route path="/components/badge" element={<ComponentPage content={badgeContent} />} />
          <Route
            path="/components/radiobutton"
            element={<ComponentPage content={radiobuttonContent} />}
          />
          <Route
            path="/components/rating-bar"
            element={<ComponentPage content={ratingBarContent} />}
          />
          <Route
            path="/components/dropdown"
            element={<ComponentPage content={dropdownContent} />}
          />
          <Route path="/components/tabs" element={<ComponentPage content={tabsContent} />} />
          <Route path="/components/listbox" element={<ComponentPage content={listboxContent} />} />
          <Route
            path="/components/joystick"
            element={<ComponentPage content={joystickContent} />}
          />
          <Route
            path="/components/view"
            element={
              <ComponentPage
                content={viewContent}
                infoBox={
                  <div className="info-box">
                    <strong>Important:</strong> An empty View without a background color is
                    invisible. Always add either a <code>backgroundColor</code> or child content to
                    make your Views visible.
                  </div>
                }
              />
            }
          />
          <Route
            path="/components/wheel-picker"
            element={<ComponentPage content={wheelPickerContent} />}
          />
          <Route
            path="/components/scroll-view"
            element={<ComponentPage content={scrollviewContent} />}
          />
          <Route path="/components/divider" element={<ComponentPage content={dividerContent} />} />
          <Route path="/components/portal" element={<ComponentPage content={portalContent} />} />
          <Route path="/components/popover" element={<ComponentPage content={popoverContent} />} />
          <Route path="/components/modal" element={<ComponentPage content={modalContent} />} />
          <Route path="/components/dialog" element={<ComponentPage content={dialogContent} />} />
          <Route
            path="/components/alertdialog"
            element={<ComponentPage content={alertdialogContent} />}
          />
          <Route path="/components/toast" element={<ComponentPage content={toastContent} />} />
          <Route
            path="/components/accordion"
            element={<ComponentPage content={accordionContent} />}
          />
          <Route
            path="/components/activity-indicator"
            element={<ComponentPage content={activityIndicatorContent} />}
          />
          <Route path="/components/text" element={<ComponentPage content={textContent} />} />
          <Route
            path="/components/wraptext"
            element={<ComponentPage content={wraptextContent} />}
          />{' '}
          <Route
            path="/components/bottom-sheet"
            element={<ComponentPage content={bottomSheetContent} />}
          />{' '}
          <Route
            path="/components/chartext"
            element={<ComponentPage content={chartextContent} />}
          />
          <Route
            path="/components/chartextinput"
            element={<ComponentPage content={chartextinputContent} />}
          />
          <Route path="/components/icon" element={<ComponentPage content={iconContent} />} />
          <Route path="/components/image" element={<ComponentPage content={imageContent} />} />
          <Route path="/components/sprite" element={<ComponentPage content={spriteContent} />} />
          <Route
            path="/components/tilesprite"
            element={<ComponentPage content={tileSpriteContent} />}
          />
          <Route
            path="/components/particles"
            element={<ComponentPage content={particlesContent} />}
          />
          <Route
            path="/components/graphics"
            element={<ComponentPage content={graphicsContent} />}
          />
          <Route
            path="/components/nineslice-button"
            element={<ComponentPage content={nineSliceButtonContent} />}
          />
          <Route
            path="/components/ref-origin-view"
            element={<ComponentPage content={refOriginViewContent} />}
          />
          <Route
            path="/components/transform-origin-view"
            element={<ComponentPage content={transformOriginViewContent} />}
          />
          <Route path="/guides/best-practices" element={<BestPracticesPage />} />
          <Route path="/guides/testing" element={<TestingPage />} />
          <Route path="/guides/scene-backgrounds" element={<SceneBackgroundsPage />} />
          <Route path="/guides/effects-animations" element={<EffectsPage />} />
          <Route path="/guides/gestures" element={<GesturesPage />} />
          <Route path="/guides/tooltips" element={<TooltipsPage />} />
          <Route path="/guides/layout-patterns" element={<LayoutPatternsPage />} />
          <Route path="/guides/performance" element={<PerformancePage />} />
          <Route path="/guides/responsive-design" element={<ResponsiveDesignPage />} />
          <Route path="/guides/theme-system" element={<ThemeSystemPage />} />
          <Route path="/guides/phaserjsx-plugin" element={<PhaserJsxPluginPage />} />
          <Route path="/guides/icon-system" element={<IconSystemPage />} />
          <Route path="/guides/icon-generator-config" element={<IconGeneratorConfigPage />} />
          <Route path="/guides/custom-icon-component" element={<CustomIconComponentPage />} />
          <Route path="/guides/custom-svg-icons" element={<CustomSvgIconsPage />} />
          <Route path="/api/hooks" element={<HooksApiPage />} />
          <Route path="/api/core-props" element={<CorePropsApiPage />} />
          <Route path="/api/theme-types" element={<ThemeTypesApiPage />} />
          <Route path="/api/effects" element={<EffectRegistryApiPage />} />
          <Route path="/components/*" element={<ComingSoonPage />} />
          <Route path="/guides/*" element={<ComingSoonPage />} />
          <Route path="*" element={<ComingSoonPage />} />
        </Routes>
      </BrowserRouter>
    </DocsThemeProvider>
  )
}

export default App
