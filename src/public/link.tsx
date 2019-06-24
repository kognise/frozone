import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import Context from '../Context'
import { log } from '../util'

interface LinkProps {
  children?: ReactNode
  href: string
}

const Link: FunctionComponent<LinkProps> = ({ href, children }) => {
  const { useLinkSuffix } = React.useContext(Context)

  const child = React.Children.toArray(children)[0]
  href = (useLinkSuffix && !/^.+(\..+|\/)$/.test(href)) ? `${href}.html` : href

  if (!child) {
    return <a href={href} />
  } else if (typeof child === 'string') {
    log('You\'re using a string directly inside <Link>. Instead, please add an <a> tag as the child of <Link>', true, 'yellow')

    return (
      <a href={href}>
        {child}
      </a>
    )
  } else {
    return React.cloneElement(child as ReactElement, { href })
  }
}
export default Link