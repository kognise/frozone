import { FunctionComponent } from 'react'

/**
 * Frozone counterpart of React.FC/React.FunctionComponent
 * with typings for `getInitialProps()`.
 */
export interface FunctionPage<P = {}> extends FunctionComponent {
  getInitialProps?: () => P | Promise<P>
}