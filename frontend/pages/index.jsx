// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

import Link from 'next/link'
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Ciy Builder</title>
      </Head>

      <main>
        <div>
          <Link href="/"><a><h1>City Builder</h1></a></Link>
          <Link href="/game"><a><h2>Game</h2></a></Link>
          <Link href="#mint"><a><h2>Mint</h2></a></Link>
          <Link href="#roadmap"><a><h2>Roadmap</h2></a></Link>
          <Link href="#walkthrough"><a><h2>Walkthrough</h2></a></Link>
          <Link href="#faqs"><a><h2>FAQs</h2></a></Link>
        </div>
        <p id='something'>
          something <br/>
          something <br/>
          something <br/>
          something <br/>
          something <br/>
          something <br/>
        </p>
        <p id='something1'>
          something 1 <br/>
          something 1 <br/>
          something 1 <br/>
          something 1 <br/>
          something 1 <br/>
          something 1 <br/>
        </p>
      </main>
    </div>
  )
}
