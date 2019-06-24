import React from 'react'
import Context from '../Context'
import { log } from '../util'

export default ({ href, children }) => {
  const { useLinkSuffix } = React.useContext(Context)

  const child = React.Children.toArray(children)[0]
  href = (useLinkSuffix && !/^.+(\..+|\/)$/.test(href)) ? `${href}.html` : href

  if (!child) {
    return React.createElement('a', { href })
  } else if (typeof child === 'string') {
    log('You\'re using a string directly inside <Link>. Instead, please add an <a> tag as the child of <Link>', true, 'yellow')
    return React.createElement('a', { href }, child)
  } else {
    return React.cloneElement(child, { href })
  }
}