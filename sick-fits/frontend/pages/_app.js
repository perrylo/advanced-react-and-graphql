/*
 *** This file is special in Next.js and is a reserved filename -
 controls everything in HTML doc, applies things globally
 */
import NProgress from 'nprogress'
import Router from 'next/router'
import { ApolloProvider } from '@apollo/client'
import PropTypes from 'prop-types'
import Page from '../components/Page'

import '../components/styles/nprogress.css'
import withData from '../lib/withData'
import { CartStateProvider } from '../lib/cartState'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

// When we export our app, apollo will automatically be bundled, hence we have it here
// This is done by wrapping the MyApp obj with withData on the default export (see below)
function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <CartStateProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartStateProvider>
    </ApolloProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
  apollo: PropTypes.any,
}

// Tell NextJS to fetch all the queries in all the children components
// .getInitialProps is NextJS specific...
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  pageProps.query = ctx.query
  return { pageProps }
}

export default withData(MyApp)
