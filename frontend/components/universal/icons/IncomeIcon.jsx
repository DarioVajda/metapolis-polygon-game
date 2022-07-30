import React from 'react'

import style from './incomeIcon.module.css'

const IncomeIcon = ({ size, unit }) => {
  return (
    <div className={style.incomeIcon}>
      <svg className={style.incomeCoin} xmlns="http://www.w3.org/2000/svg" width={`${size?size:1}${unit?unit:'em'}`} height={`${size?size:1}${unit?unit:'em'}`} preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><path fill="currentColor" d="M7.5 1a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zm0 13.5a6 6 0 1 1 0-12a6 6 0 0 1 0 12zM8 8V6h2V5H8V4H7v1H5v4h2v2H5v1h2v1h1v-1h2V8H8zM7 8H6V6h1v2zm2 3H8V9h1v2z"/></svg>
      <svg className={style.incomeArrow} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width={`${size?size*1.4/1.5:1}${unit?unit:'em'}`} height={`${size?size*1.4/1.5:1}${unit?unit:'em'}`} preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100"><path fill="currentColor" d="M78.016 49.132L51.961 12.714a2.516 2.516 0 0 0-2.043-1.051h-.006a2.52 2.52 0 0 0-2.048 1.059L21.977 49.14a2.513 2.513 0 0 0-.183 2.612a2.509 2.509 0 0 0 2.236 1.361h12.183l-.001 32.709a2.514 2.514 0 0 0 2.516 2.515l22.541-.001a2.515 2.515 0 0 0 2.516-2.517V53.114h12.187c.94 0 1.803-.53 2.237-1.367a2.513 2.513 0 0 0-.193-2.615z"/></svg>
    </div>
  )
}

export default IncomeIcon