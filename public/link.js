const React = require('react')
const Context = require('../Context')
const { log } = require('../util')

module.exports = ({ href, children }) => {
  const { appendLinkExtension } = React.useContext(Context)

  const child = React.Children.toArray(children)[0]

  if (!child) {
    return React.createElement('a', {
      href: (appendLinkExtension && /^.+(\..+|\/)$/.test(href)) ? `${href}.html` : href
    })
  } else if (typeof child === 'string') {
    log('You\'re using a string directly inside <Link>. Instead, please add an <a> tag as the child of <Link>', true, 'yellow')
    return React.createElement('a', {
      href: (appendLinkExtension && /^.+(\..+|\/)$/.test(href)) ? `${href}.html` : href
    }, child)
  } else {
    return React.cloneElement(child, {
      href: (appendLinkExtension && /^.+(\..+|\/)$/.test(href)) ? `${href}.html` : href
    })
  }
}