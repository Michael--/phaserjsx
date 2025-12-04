/** @jsxImportSource react */
import {
  CodeBlock,
  DocParagraph,
  DocSection,
  DocTitle,
  SectionTitle,
} from '../components/Doc/Typography'
import { DocLayout } from '../components/Layout/DocLayout'
import declarativeCode from '../examples-docs/introduction/declarative-example.tsx?raw'
import imperativeCode from '../examples-docs/introduction/imperative-example.ts?raw'
import '../styles/docs.css'

/**
 * Introduction page explaining PhaserJSX concept and benefits
 */
export function IntroductionPage() {
  return (
    <DocLayout>
      <DocTitle>Introduction to PhaserJSX</DocTitle>

      <DocParagraph>
        PhaserJSX is a modern, declarative UI framework for Phaser 3 that brings React-like
        development patterns to game and interactive application development. It transforms the way
        you build user interfaces in Phaser by introducing JSX syntax, hooks, and a component-based
        architecture.
      </DocParagraph>

      <DocSection>
        <SectionTitle>What is PhaserJSX?</SectionTitle>
        <DocParagraph>
          At its core, PhaserJSX is a virtual DOM (VDOM) implementation specifically designed for
          Phaser's GameObject system. It provides a React-like developer experience while leveraging
          Phaser's powerful rendering engine and game development features.
        </DocParagraph>
        <DocParagraph>
          Instead of imperatively creating and managing GameObjects, you describe your UI
          declaratively using JSX components. PhaserJSX handles the complexity of creating,
          updating, and destroying Phaser GameObjects efficiently while you focus on building your
          game's logic and user experience.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <SectionTitle>The Problem with Imperative UI Development</SectionTitle>
        <DocParagraph>
          Traditional Phaser development follows an imperative paradigm where you manually create,
          update, and destroy GameObjects. This approach has several challenges:
        </DocParagraph>

        <div className="doc-list">
          <div className="doc-list-item">
            <strong>Manual State Management:</strong> You must explicitly track and update
            GameObjects when state changes, leading to verbose and error-prone code.
          </div>
          <div className="doc-list-item">
            <strong>Lifecycle Complexity:</strong> Managing GameObject lifecycles (creation,
            updates, cleanup) becomes increasingly complex as your UI grows.
          </div>
          <div className="doc-list-item">
            <strong>Poor Reusability:</strong> Creating reusable UI components requires significant
            boilerplate and careful coordination between different parts of your codebase.
          </div>
          <div className="doc-list-item">
            <strong>Difficult Testing:</strong> Imperative code with scattered state mutations is
            harder to test and reason about.
          </div>
          <div className="doc-list-item">
            <strong>Maintenance Burden:</strong> As features grow, imperative code becomes
            increasingly difficult to maintain and refactor.
          </div>
        </div>

        <CodeBlock language="typescript" title="Imperative Phaser Example">
          {imperativeCode}
        </CodeBlock>
      </DocSection>

      <DocSection>
        <SectionTitle>The PhaserJSX Solution: Declarative UI</SectionTitle>
        <DocParagraph>
          PhaserJSX transforms this imperative complexity into clean, declarative code. You describe{' '}
          <em>what</em>
          your UI should look like, not <em>how</em> to build it. The framework handles all
          GameObject lifecycle management automatically.
        </DocParagraph>

        <CodeBlock language="typescript" title="Declarative PhaserJSX Example">
          {declarativeCode}
        </CodeBlock>

        <DocParagraph>Notice how the PhaserJSX version:</DocParagraph>
        <div className="doc-list">
          <div className="doc-list-item">
            <strong>Automatic Updates:</strong> When state changes, the UI updates automatically -
            no manual GameObject manipulation required.
          </div>
          <div className="doc-list-item">
            <strong>Component-Based:</strong> UI is composed of reusable, self-contained components.
          </div>
          <div className="doc-list-item">
            <strong>Clean Lifecycle:</strong> No manual cleanup needed - PhaserJSX handles
            GameObject destruction.
          </div>
          <div className="doc-list-item">
            <strong>Readable & Maintainable:</strong> Code clearly expresses UI structure and
            behavior.
          </div>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>Key Advantages of PhaserJSX</SectionTitle>

        <div className="doc-subsection">
          <h3>1. React-Like Developer Experience</h3>
          <DocParagraph>
            If you know React, you already know PhaserJSX. The same patterns, hooks, and mental
            models apply:
          </DocParagraph>
          <div className="doc-list">
            <div className="doc-list-item">
              <code>useState</code> for component state
            </div>
            <div className="doc-list-item">
              <code>useEffect</code> for side effects and lifecycle
            </div>
            <div className="doc-list-item">
              <code>useRef</code> for GameObject references
            </div>
            <div className="doc-list-item">
              <code>useMemo</code> for performance optimization
            </div>
            <div className="doc-list-item">JSX for declarative UI structure</div>
          </div>
        </div>

        <div className="doc-subsection">
          <h3>2. Powerful Layout System</h3>
          <DocParagraph>
            Built-in Flexbox-inspired layout engine with support for percentage units, viewport
            units (vw/vh), calc() expressions, and automatic positioning. No more manual coordinate
            calculations.
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>3. Type-Safe Theme System</h3>
          <DocParagraph>
            Comprehensive theming with TypeScript autocomplete, design tokens, nested themes, and
            automatic inheritance. Create consistent UIs with less code.
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>4. Rich Component Library</h3>
          <DocParagraph>
            Production-ready components including Button, Checkbox, Dropdown, Slider, Modal,
            Tooltip, Accordion, ScrollView, and more. All fully themed and customizable.
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>5. Advanced Animations</h3>
          <DocParagraph>
            Spring physics animations with <code>useSpring</code>, GameObject effects (shake, pulse,
            bounce), and full Phaser FX pipeline integration (shadows, glow, blur, etc.).
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>6. Performance-Optimized</h3>
          <DocParagraph>
            Smart VDOM diffing, automatic batching, memoization support, and React-like warnings for
            common performance pitfalls. Build fast UIs with confidence.
          </DocParagraph>
        </div>

        <div className="doc-subsection">
          <h3>7. Phaser-Native Integration</h3>
          <DocParagraph>
            Direct access to Phaser GameObjects via refs, full FX pipeline support, gesture system
            integration, and seamless interop with existing Phaser code. You're not locked into a
            framework - you're enhanced by it.
          </DocParagraph>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>When to Use PhaserJSX</SectionTitle>

        <div className="doc-subsection">
          <h3>✅ Perfect For:</h3>
          <div className="doc-list">
            <div className="doc-list-item">
              <strong>Complex Game UIs:</strong> Menus, HUDs, inventory systems, dialog trees
            </div>
            <div className="doc-list-item">
              <strong>Interactive Applications:</strong> Educational tools, data visualizations,
              simulations
            </div>
            <div className="doc-list-item">
              <strong>Rapid Prototyping:</strong> Quickly iterate on UI designs and interactions
            </div>
            <div className="doc-list-item">
              <strong>Team Development:</strong> Component-based architecture scales well with
              multiple developers
            </div>
            <div className="doc-list-item">
              <strong>Large Codebases:</strong> Maintainable, testable code that grows gracefully
            </div>
          </div>
        </div>

        <div className="doc-subsection">
          <h3>⚠️ Consider Alternatives For:</h3>
          <div className="doc-list">
            <div className="doc-list-item">
              <strong>Simple Static UIs:</strong> Basic text displays might be overkill for
              PhaserJSX
            </div>
            <div className="doc-list-item">
              <strong>Performance-Critical Rendering:</strong> Heavy particle systems or
              shader-heavy scenes should use native Phaser
            </div>
            <div className="doc-list-item">
              <strong>Minimal Interactivity:</strong> If you don't need state management, vanilla
              Phaser is simpler
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection>
        <SectionTitle>Architecture Overview</SectionTitle>
        <DocParagraph>
          PhaserJSX sits between your application code and Phaser's rendering engine:
        </DocParagraph>

        <div className="architecture-diagram">
          <div className="arch-layer">
            <strong>Your Components</strong>
            <span>JSX + Hooks + State Management</span>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <strong>PhaserJSX VDOM</strong>
            <span>Diffing, Reconciliation, Lifecycle</span>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <strong>Phaser GameObjects</strong>
            <span>Rendering, Input, Physics</span>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-layer">
            <strong>WebGL/Canvas</strong>
            <span>Hardware-Accelerated Graphics</span>
          </div>
        </div>

        <DocParagraph>
          This architecture ensures you get the best of both worlds: React-like DX with Phaser's
          rendering performance.
        </DocParagraph>
      </DocSection>

      <DocSection>
        <SectionTitle>Next Steps</SectionTitle>
        <DocParagraph>
          Ready to get started? Head to the Installation Guide to set up PhaserJSX in your project,
          then explore the Component Documentation to see what you can build.
        </DocParagraph>
        <div className="doc-list">
          <div className="doc-list-item">
            <a href="/installation">Installation Guide</a> - Set up PhaserJSX in your project
          </div>
          <div className="doc-list-item">
            <a href="/components/button">Button Component</a> - Interactive button examples
          </div>
          <div className="doc-list-item">
            <a href="/guides/testing">Testing Guide</a> - Learn how to create examples
          </div>
        </div>
      </DocSection>
    </DocLayout>
  )
}
