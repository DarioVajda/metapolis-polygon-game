import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import ReactDom from 'react-dom'

import { useBuildingStore } from '../BuildingStore';

import styles from './popup.module.css';

import AchievementList from '../../achievements/AchievementList';
import PopupModule from '../../universal/PopupModule';
import MakeOffer from './MakeOffer';
import DiscardChanges from './DiscardChanges';
import PreviewChanges from './PreviewChanges';
import Leaderboard from './Leaderboard/Leaderboard';
import ChooseCity from '../../merge/ChooseCity';

const Errors = ({ children }) => {

  const [ show, setShow ] = useState(false);

  useEffect(() => {
    if(typeof window === 'object') setShow(true);
  }, []);

  if(show) return ReactDom.createPortal(
    children,
    document.getElementById('errors')
  )
  else return null;
}

const Popup = () => {

  const delay = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  const popup = useBuildingStore(state => state.popup);
  const setPopup = useBuildingStore(state => state.setPopup);
  const errors = useBuildingStore(state => state.errors);
  const addError = useBuildingStore(state => state.addError);
  const removeError = useBuildingStore(state => state.removeError);
  const staticData = useBuildingStore(state => state.staticData);
  
  const showingError = useRef(false);

  const closePopup = () => {
    setPopup({});
  }

  useEffect(() => {
    if(errors.length === 0 || showingError.current) return;

    const waitForError = async () => {
      showingError.current = true;
      await delay(errors[0].duration);
      showingError.current = false;
      removeError(errors[0].message, errors[0].duration);
    }

    waitForError();

  }, [ errors ]);

  // console.log(popup, errors);

  return (
    <>
      {/* Achievements */}
      <PopupModule open={popup.type==='achievements'} width={75} height={85} unit='%' >
        <AchievementList id={staticData.id} closePopup={closePopup} />
      </PopupModule>

      {/* Making offers */}
      <PopupModule open={popup.type==='make-offer'} width={50} height={60} unit='%' >
        <MakeOffer closePopup={closePopup} type={popup.options?.type} />
      </PopupModule>

      {/* Discard changes */}
      <PopupModule open={popup.type==='discard-changes'} width={22} height={12} unit='em' >
        <DiscardChanges closePopup={closePopup} />
      </PopupModule>

      {/* Preview changes */}
      <PopupModule open={popup.type==='preview-changes'} width={40} height={50} unit='%' >
        <PreviewChanges closePopup={closePopup} />
      </PopupModule>

      {/* Leaderboard */}
      <PopupModule open={popup.type==='leaderboard'} width={60} height={70} unit='%'>
        <Leaderboard closePopup={closePopup} />
      </PopupModule>

      {/* Choose City */}
      <PopupModule open={popup.type==='choose-city'} width={60} height={80} unit='%'>
        <ChooseCity closePopup={closePopup} first={popup.first} nfts={popup.nfts} />
      </PopupModule>

      <Errors>
        <div className={styles.errorWrapper}>
          <div 
            key={errors[0]?.message}
            className={styles.errorFadeOut}
            style={{ animationDelay: `${(errors[0] ? errors[0].duration : 200) - 200}ms`, animationDuration: '200ms' }}
          >
            <div className={styles.error} style={errors[0] === undefined ? { display: 'none' } : {}}>
              {errors[0]?.message}
            </div>
          </div>
        </div>
      </Errors>
    </>
  )
}

export default Popup