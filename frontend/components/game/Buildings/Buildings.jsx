import React from 'react'

import NormalBuildings from './NormalBuildings';
import SpecialBuildings from './SpecialBuildings';
import Grid from './Grid';
import { useEffect } from 'react';

import { useBuildingStore } from '../BuildingStore';
import { specialTypes } from '../../../../server/gameplay/building_stats';

const Buildings = ({ id, data, showGrid, prefixID, offset }) => {

  const setBuildings = useBuildingStore(state => state.setBuildings);
  const setSpecialBuildings = useBuildingStore(state => state.setSpecialBuildings);
  const changeStaticData = useBuildingStore(state => state.changeStaticData);
  const changeDynamicData = useBuildingStore(state => state.changeDynamicData);
  const calculateIncome = useBuildingStore(state => state.calculateIncome);
  const changeSpecialBuildingData = useBuildingStore(state => state.changeSpecialBuildingData);

  const setUnchangedData = useBuildingStore(state => state.setUnchangedData);

  const setFloatingMenu = useBuildingStore(state => state.setFloatingMenu);

  const loadData = async () => {
    // fetching the data if it was not sent as an argument
    let _data;
    if(data) {
      _data = data;
    }
    else {
      _data = await (await fetch(`http://localhost:8000/cities/${id}/data`)).json();
    }

    setBuildings(_data.buildings, prefixID);
    setSpecialBuildings(_data.specialBuildings, prefixID);
    changeStaticData({
      id: id,
      owner: _data.owner,
      created: _data.created,
      initialized: _data.initialized,
      theme: _data.theme,
      dimensions: _data.dimensions,
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
    calculateIncome();
    
    setUnchangedData();
  }

  const loadSpecialBuildingData = async () => {
    const loadSingleTypeData = async (_type) => {
      let _data = await (await fetch(`http://localhost:8000/specialtype/${_type}`)).json();

      changeSpecialBuildingData(_data, _type);
    }
    
    Object.values(specialTypes).forEach(({ type } )=> {
      loadSingleTypeData(type);
    });

    setUnchangedData();
  }

  useEffect(() => {
    loadData();
    if(!data) {
      loadSpecialBuildingData();
    }
  }, []);

  const onClick = (building, ref) => {
    if(!ref) {
      console.log('NO REF WAS SENT');
    }
    if(!building) {
      console.log('NO BUILDING WAS SENT');
    }

    // console.log(building, ref);
    setFloatingMenu({ building, position: ref.current.position});
  }

  const onGridClick = (x, y) => {

  }

  return (
    <group>
      <NormalBuildings onClick={onClick} data={data} prefix={prefixID} offset={offset} />
      <SpecialBuildings onClick={onClick} data={data} prefix={prefixID} offset={offset} />
      { showGrid && <Grid onClick={onGridClick} /> }
    </group>
  )
}

export default Buildings