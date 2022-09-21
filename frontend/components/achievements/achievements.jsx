import { buildingTypes } from "../../../server/gameplay/building_stats";
import { 
    rewardTypes as rewardTypesImport, 
    achievements as achievementsImport, 
    dateToUnix,
    checkIfActive 
} from '../../../server/blockchain_api/achievements';

import GreenCityIcon from '../universal/icons/achievement_icons/GreenCityIcon';
import Placeholder from '../universal/icons/achievement_icons/Placeholder';
import EducatedCityIcon from '../universal/icons/achievement_icons/EducatedCityIcon';
import SkyCityIcon from '../universal/icons/achievement_icons/SkyCityIcon';

const rewardTypes = rewardTypesImport;

const achievementsJsx = {
    greenCity: <>+5%</>,
    educatedCity: <div style={{fontSize:'1.2rem',backgroundColor:'transparent'}}>BOOST</div>,
    skyCity: <>500000</>,
    check4: <>100</>,
}

const achievementIcons = {
    greenCity: (props) => <GreenCityIcon {...props} />,
    educatedCity: (props) => <EducatedCityIcon {...props} />,
    skyCity: (props) => <SkyCityIcon {...props} />,
    check4: (props) => <Placeholder {...props} />,
}

const achievements = achievementsImport;
Object.keys(achievementsJsx).forEach((element) => {
    achievements[element] = { 
        ...achievements[element], 
        rewardValueJsx: achievementsJsx[element],
        achievementIcon: achievementIcons[element]
    }
})

export { rewardTypes, achievements, checkIfActive, dateToUnix };