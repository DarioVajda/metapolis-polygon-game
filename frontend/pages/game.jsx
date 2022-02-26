import React from 'react'
import Link from 'next/link'

const Game = () => {
  return (
    <div>
        <h1>Game</h1>
        <Link href='/'><a>Home</a></Link>
        <Link href='/leaderboard'><a>Leaderboard</a></Link>
    </div>
  )
}

export default Game