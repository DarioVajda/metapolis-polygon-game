import { buildingTypes } from "../../../server/gameplay/building_stats";
import { 
    rewardTypes as rewardTypesImport, 
    achievements as achievementsImport, 
    dateToUnix,
    checkIfActive 
} from '../../../server/blockchain_api/achievements';

const rewardTypes = rewardTypesImport;

const achievementsJsx = {
    greenCity: <>+5%</>,
    educatedCity: <div style={{fontSize:'1.2rem',backgroundColor:'transparent'}}>BOOST</div>,
    skyCity: <>500000</>,
    check4: <>100</>,
}

const achievements = achievementsImport;
Object.keys(achievementsJsx).forEach((element) => {
    achievements[element] = { ...achievements[element], rewardValueJsx: achievementsJsx[element] }
})

export { rewardTypes, achievements, checkIfActive, dateToUnix };