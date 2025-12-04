/**
 * Call-to-action buttons component
 */
/** @jsxImportSource react */
import { Link } from 'react-router-dom'

interface CTAButton {
  to: string
  text: string
  variant?: 'primary' | 'secondary'
}

interface CTAButtonsProps {
  buttons: CTAButton[]
}

/**
 * CTA buttons for navigation
 */
export function CTAButtons({ buttons }: CTAButtonsProps) {
  return (
    <div className="cta-buttons">
      {buttons.map((button) => (
        <Link
          key={button.to}
          to={button.to}
          className={`cta-button cta-button-${button.variant || 'secondary'}`}
        >
          {button.text}
        </Link>
      ))}
    </div>
  )
}
