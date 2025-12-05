/**
 * View Component Documentation Page
 */
import { ComponentPage } from '@/components/ComponentPage'
import { viewContent } from '@/content/view.content'

/**
 * View component documentation page
 */
export function ViewPage() {
  return (
    <ComponentPage
      content={viewContent}
      infoBox={
        <div className="info-box">
          <strong>Important:</strong> An empty View without a background color is invisible. Always
          add either a <code>backgroundColor</code> or child content to make your Views visible.
        </div>
      }
    />
  )
}
