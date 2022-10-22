import React from 'react'

import NormalBuildings from './NormalBuildings';
import SpecialBuildings from './SpecialBuildings';
import Grid from './Grid';
import { useEffect } from 'react';

import { useBuildingStore } from '../BuildingStore';

const Buildings = ({ id }) => {

  const setBuildings = useBuildingStore(state => state.setBuildings);
  const setSpecialBuildings = useBuildingStore(state => state.setSpecialBuildings);
  const changeStaticData = useBuildingStore(state => state.changeStaticData);
  const changeDynamicData = useBuildingStore(state => state.changeDynamicData);

  const loadData = async () => {
    // console.log(`http://localhost:8000/cities/${id}/data`);
    let _data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();

    setBuildings(_data.buildings);
    setSpecialBuildings(_data.specialBuildings);
    changeStaticData({
      owner: _data.owner,
      created: _data.created,
      initialized: _data.initialized,
      theme: _data.theme,
    });
    changeDynamicData({
      specialBuildingCash: _data.specialBuildingCash,
      money: _data.money,
      incomesReceived: _data.incomesReceived,
      buildingId: _data.buildingId,
      sepcialBuildingId: _data.sepcialBuildingId,
      normal: _data.normal,
      educated: _data.educated,
      normalWorkers: _data.normalWorkers,
      educatedWorkers: _data.educatedWorkers,
      achievementList: _data.achievementList,
      income: _data.income,
      score: _data.score,
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <group>
      <NormalBuildings />
      <SpecialBuildings />
      <Grid />
    </group>
  )
}

export default Buildings