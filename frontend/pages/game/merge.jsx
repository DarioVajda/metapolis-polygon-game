import React from 'react'

import { useRouter } from 'next/router';

import Popup from '../../components/game/popup/Popup';

import MergeUI from '../../components/merge/MergeUI';
import MergeLandscape from '../../components/merge/MergeLandscape';

import styles from '../../components/merge/merge.module.css';

const merge = () => {

  const router = useRouter();
  const route = router.query;

  // console.log({router});

  return (
    <div className={styles.wrapper} >
      <MergeLandscape />
      <MergeUI {...route} />
      <Popup />
    </div>
  )
}

export default merge