# nft
Veoma kul NFT igrica

Link sa planom: https://docs.google.com/document/d/1N5JJ_vFZnwMK2x3V3N10S3gp2jUgTS2vrKhAAfvktEs/edit

import './Map.sol';

contract Map is BuildingTypes {
  struct MapLand {
    uint128 occupiedBy;
    uint128 productivity;
    bool storeNearby;
    uint128 gymBoost;
    uint128 parkBoost;
  }
  
  function getMap(Building[] memory buildingList) internal returns(memory MapLand[][]) {
    MapLand[][] memory map = new MapLand[mapDimensions][mapDimensions]();
    uint128 numOfBuildings = // ovde treba da se izracuna nekako broj gradjevina
    
    for(uint i = 0; i < mapDimensions; i++) {
      for(uint j = 0; j < mapDimensions; j++) {
        map[i][j].productivity = 100;
        map[i][j].gymBoost = 100;
        map[i][j].parkBoost = 100;
        map[i][j].occupiedBy = numOfBuildings;
        map[i][j].storeNearby = false;
      }
    }
    
    uint32 houseBoost = 130;
    for(uint i = 0; i < numOfBuildgings; i++) {
      if(buildingList[i].buildingType == BuildingTypes.House) {
        map[buildingList[i].starty][buildingList[i].startx] = map[buildingList[i].starty][buildingList[i].startx] * houseBoost / 100;
      }
      else if() {
        
      }
      else if() {
        
      }
      else if() {
        
      }
      ...
    }
  }
}
