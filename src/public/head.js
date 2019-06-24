import React from 'react'
import Context from '../Context'

export default ({ children }) => {
  React.useContext(Context).head = React.Children.toArray(children)
  return null
}