import React, { FunctionComponent } from 'react'
import Context from '../Context'

const Head: FunctionComponent = ({ children }) => {
  React.useContext(Context).head = React.Children.toArray(children)
  return null
}
export default Head