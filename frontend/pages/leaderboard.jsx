import React from 'react'

import Nav from '../components/Nav'
import LeaderboardList from '../components/Leaderboard/LeaderboardList'

import styles from '../styles/leaderboard.module.css'

const leaderboard = () => {

  var timeLeft = 86400*3; // this is how much time is left until the next round of elimination (in seconds), it could be moved to a seperate component and have a state changing every second showing the time

  const secToString = (sec) => {
    return sec + ' seconds';
  }

  return (
    <>
      <title>Leaderboard</title>
      <Nav /> {/* Ovo treba da bude drugaciji navigation bar */}
      <div className={styles.leaderboard}>
        <div>
          <h1>Leaderboard</h1>
          <LeaderboardList />
        </div>
      </div>
    </>
  )
}

export default leaderboard