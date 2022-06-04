import React from 'react'
import Head from 'next/head';

import Profile from '../components/Profile/Profile';
import Nav from '../components/Nav';

const profile = () => {
  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      <main>
        <Nav />
        <Profile />
      </main>
    </div>
  )
}

export default profile