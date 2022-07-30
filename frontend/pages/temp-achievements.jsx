import React from 'react'
import { useState } from 'react';

import AchievementList from '../components/achievements/AchievementList';
import PopupModule from '../components/universal/PopupModule';

const achievements = () => {

  const [open, setOpen] = useState(false);

  return (
    <div style={{}}>
      <button onClick={() => setOpen(true)} >Open Popup</button>

      <PopupModule open={open} width={75} height={85} unit={'%'} >
        <AchievementList id={0} closePopup={() => setOpen(false)} />
      </PopupModule>
    </div>
  )
}

export default achievements