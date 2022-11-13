import React from 'react'

import { useBuildingStore } from '../BuildingStore';

import AchievementList from '../../achievements/AchievementList';
import PopupModule from '../../universal/PopupModule';
import MakeOffer from './MakeOffer';

const Popup = () => {

  const popup = useBuildingStore(state => state.popup);
  const setPopup = useBuildingStore(state => state.setPopup);
  const staticData = useBuildingStore(state => state.staticData);

  const closePopup = () => {
    setPopup({});
  }

  console.log(popup);

  return (
    <>
      {/* Achievements */}
      <PopupModule open={popup.type==='achievements'} width={75} height={85} unit={'%'} >
        <AchievementList id={staticData.id} closePopup={closePopup} />
      </PopupModule>

      {/* Making offers */}
      <PopupModule open={popup.type==='make-offer'} width={50} height={60} unit={'%'} >
        <MakeOffer closePopup={closePopup} type={popup.options?.type} />
      </PopupModule>
    </>
  )
}

export default Popup