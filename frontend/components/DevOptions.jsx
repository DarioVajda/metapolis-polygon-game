import React from 'react'

const DevOptions = ({ mintERC20 }) => {
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h4>_________________________________________________________________________________________________</h4>
      <h4>Dev options:</h4>
      <h5 onClick={() => mintERC20()}>Get 1 weth token</h5>
      <h5 onClick={() => mintERC20()}>Set NFT price in contract</h5>
    </div>
  )
}

export default DevOptions