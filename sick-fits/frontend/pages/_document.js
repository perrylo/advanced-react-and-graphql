/*
 *** This file is special in Next.js and is a reserved filename -
 controls everything in HTML doc, applies things globally
 */

import Document, { Html, Head, NextScript, Main } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    // Use Next 'getInitialProps' hook to overcome FOUC
    // Google: ServerStyleSheet Styled-Components
    const sheet = new ServerStyleSheet()
    const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render() {
    return (
      <Html lang="en-ca">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
