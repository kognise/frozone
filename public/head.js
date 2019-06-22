const { Children, useContext } = require('react')
const HeadContext = require('../contexts/HeadContext')

module.exports = ({ children }) => {
  useContext(HeadContext).head = Children.toArray(children)
  return null
}