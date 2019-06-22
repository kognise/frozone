const React = require('react')
const value = { head: [] }
module.exports = React.createContext()
module.exports.Wrapper = ({ children }) => React.createElement(
  module.exports.Provider,
  { value },
  children
)