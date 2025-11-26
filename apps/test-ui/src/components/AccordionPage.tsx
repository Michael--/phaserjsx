import { View, type ChildrenType } from '@phaserjsx/ui'

/**
 * Props for AccordionPage component
 */
export interface AccordionPageProps {
  /** Content children */
  children?: ChildrenType
  /** Additional styling props */
  width?: number
  height?: number
  padding?: number
}

/**
 * AccordionPage component - content container for Accordion
 * @param props - AccordionPage properties
 * @returns AccordionPage JSX element
 */
export function AccordionPage(props: AccordionPageProps) {
  return (
    <View width={props.width} height={props.height} padding={props.padding} direction="column">
      {props.children}
    </View>
  )
}
