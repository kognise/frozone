const React = require('react')
const Context = require('../Context')

module.exports = ({ children }) => {
  React.useContext(Context).head = React.Children.toArray(children)
  return null
}