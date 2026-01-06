import { BehaviorSubject } from 'rxjs'

export interface AppProps {
  /** Additional props can be defined here if needed */
  title: string
  tint$: BehaviorSubject<number>
}
