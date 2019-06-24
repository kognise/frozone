import React, { FunctionComponent, ElementType } from 'react'

interface DocumentProps {
  Main: ElementType
  Head: ElementType
}

const Document: FunctionComponent<DocumentProps> = ({ Main, Head }) => (
  <html>
    <Head />
    <body>
      <Main />
    </body>
  </html>
)
export default Document