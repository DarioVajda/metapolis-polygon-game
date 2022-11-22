import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <div id='popup'></div>
      <div id='errors'></div>
    </>
  )
}

export default MyApp
