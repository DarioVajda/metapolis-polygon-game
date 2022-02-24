import Leaderboard_list from "../components/Leaderboard_list"
import { useEffect, useState } from "react"
import Link from "next/link"

const Leaderboard = () => {
  var timeLeft = 86400*3; // this is how much time is left until the next round of elimination (in seconds), it could be moved to a seperate component and have a state changing every second showing the time

  const address = '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'; // this is the BAYC address for now

  const secToString = (sec) => {
    return sec + ' seconds';
  }

  const f = async () => {
    const res = await (await fetch(`https://api.opensea.io/api/v1/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/2087/`)).json();
    // console.log(res);
  }
  f();

  return (
    <div>
      <title>Leaderboard</title>
      <div>
        This is going to be the top bar for the website <br />
        <Link href="/marketplace"><a>Marketplace</a></Link>
      </div>
      <div>
        <h1>Leaderboard</h1>
        <h3>These players are competing for part the 250 ETH prize pool</h3>
        <h3>The next round of elimination is going to be in {secToString(timeLeft)}</h3>
        <h4>
          Prize for each rank: <br />
          1 - 10 ETH<br />
          2...5 - 5 ETH<br />
          6...100 - 3 ETH<br />
          ...<br />
          1251...2500 - 0.1 ETH<br />
        </h4>
        <h5>
          * ranking of a player is determined by comparing it's score to other, score = money+20*income (for example)
        </h5>
      </div>
      <Leaderboard_list />
    </div>
  )
}

export default Leaderboard