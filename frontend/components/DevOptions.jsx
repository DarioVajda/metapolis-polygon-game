import React from 'react'

const DevOptions = ({ mintERC20, withdraw }) => {
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
      <h5 onClick={() => withdraw()}>Withdraw</h5>
      <br />
      <br />
      <br />
    </div>
  )
}

export default DevOptions