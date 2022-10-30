
import styles from './menuDataComponents.module.css';

import { buildingStats } from '../../../../server/gameplay/building_stats';

const DataBar = ({postfix, curr, next, max, upgrading, children}) => {
  return (
    <div>
      {children}
      <div>
        <div style={{ width: `${(upgrading?next:curr)/max*100}%` }}>
        </div>
        <div style={{ width: `${curr/max*100}%` }}>
          <span>{curr}{postfix?postfix:''}</span>
        </div>
        <span style={{ opacity: upgrading?1:0 }}>+{next - curr}{postfix?postfix:''}</span>
      </div>
    </div>
  )
}

const DataBarWithText = ({ text, children }) => {
  return (
    <div className={styles.twoBars}>
      <div style={{ fontSize: '1.6rem' }}>
        {text}
      </div>
      {children}
    </div>
  )
}

const getStats = (type, level) => {
  let stats = buildingStats.get(type);
  let currStats = stats[level-1];
  let nextStats = stats[level];
  let maxStats = stats.slice(-1)[0];
  return { currStats, nextStats, maxStats };
}

const menuDataComponents = {
  people: (type, level, upgrading) => {
    let { currStats, nextStats, maxStats } = getStats(type, level);

    return (
      <DataBarWithText text='People' >
        <DataBar curr={currStats.normalPeople} next={nextStats.normalPeople} max={maxStats.normalPeople} upgrading={upgrading} >
          <span>N</span> { /* TODO this is going to be an icon */}
        </DataBar>
        <DataBar curr={currStats.educatedPeople} next={nextStats.educatedPeople} max={maxStats.educatedPeople} upgrading={upgrading} >
          <span>E</span> { /* TODO this is going to be an icon */}
        </DataBar>
      </DataBarWithText>
    )
  },
  workplaces: (type, level, upgrading) => {
    let { currStats, nextStats, maxStats } = getStats(type, level);

    return (
      <DataBarWithText text='Workpalces' >
        <DataBar curr={currStats.manualWorkers} next={nextStats.manualWorkers} max={maxStats.manualWorkers} upgrading={upgrading} >
          <span>N</span> { /* TODO this is going to be an icon */}
        </DataBar>
        <DataBar curr={currStats.officeWorkers} next={nextStats.officeWorkers} max={maxStats.officeWorkers} upgrading={upgrading} >
          <span>E</span> { /* TODO this is going to be an icon */}
        </DataBar>
      </DataBarWithText>
    )
  },
  boost: (type, level, upgrading) => {
    let { currStats, nextStats, maxStats } = getStats(type, level);

    return (
      <DataBarWithText text='Boost'>
        <DataBar postfix='%' curr={Math.round((currStats.boost-1)*100)} next={Math.round((nextStats.boost-1)*100)} max={Math.round((maxStats.boost-1)*100)} upgrading={upgrading}>
          <span>B</span> { /* TODO this is going to be an icon */}
        </DataBar>
      </DataBarWithText>
    );
  },
  decrease: (type, level, upgrading) => {
    let { currStats, nextStats, maxStats } = getStats(type, level);
    let curr = -Math.round(currStats.maxDecrease*100);
    let next = -Math.round(nextStats.maxDecrease*100);
    let max = -Math.round(maxStats.maxDecrease*100);

    return (
      <DataBarWithText text='Polution'>
        <div>
          <span>D</span> { /* TODO this is going to be an icon */}
          <div>
            <div style={{ width: `${max/(upgrading?next:curr)*100}%` }}>
              {/* <span>+{next - curr}%</span> */}
            </div>
            <div style={{ width: `${max/curr*100}%` }}>
              <span>{curr}%</span>
            </div>
            <span style={{ opacity: upgrading?1:0 }}>{next}%</span>
          </div>
        </div>
      </DataBarWithText>
    );
  },
  income: () => {
    return (
      <></>
    )
  }
}

export {
  menuDataComponents
}