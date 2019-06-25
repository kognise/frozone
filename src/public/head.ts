import React, { FunctionComponent } from 'react'
import Context from '../Context'

/**
 * This component injects elements to the `<head>` of your page.
 */
const Head: FunctionComponent = ({ children }) => {
  React.useContext(Context).head = React.Children.toArray(children)
  return null
}
export default Head