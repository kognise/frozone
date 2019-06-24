import { Component, FunctionComponent } from 'react'

export interface FunctionPage<P = {}> extends FunctionComponent<P> {
  getInitialProps?: () => P
}

export class Page<P = {}, S = {}, SS = any> extends Component<P, S, SS> {
  getInitialProps?: () => P
}

// export interface Page<P, S, SS> extends Component<P, S, SS> {
//   getInitialProps?: () => P
// }