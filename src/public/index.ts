import { FunctionComponent } from 'react'

export interface FunctionPage<P = {}> extends FunctionComponent {
  getInitialProps?: () => P | Promise<P>
}