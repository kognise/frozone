const { Children, useContext } = require('react')
const Context = require('../Context')

module.exports = ({ children }) => {
  useContext(Context).head = Children.toArray(children)
  return null
}