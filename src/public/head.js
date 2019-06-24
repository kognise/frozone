import React from 'react'
import Context from '../Context'

module.exports = ({ children }) => {
  React.useContext(Context).head = React.Children.toArray(children)
  return null
}