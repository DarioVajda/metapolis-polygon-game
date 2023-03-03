
import Hover from '../../universal/hover/Hover';
import MoneyIcon from '../../universal/icons/MoneyIcon';
import IncomeIcon from '../../universal/icons/IncomeIcon';
import EducatedPersonIcon from '../../universal/icons/EducatedPersonIcon';
import UneducatedPersonIcon from '../../universal/icons/UneducatedPersonIcon';

import styles from './htmlContent.module.css';

const cityInfo = {
  money: (dynamicData) => (
    <div className={styles.topDataElement}>
      <MoneyIcon /> 
      <div>{dynamicData.money.toLocaleString('en-US')}</div>
    </div>
  ),
  income: (dynamicData) => (
    <div className={styles.topDataElement}>
      <IncomeIcon /> 
      <div>{dynamicData.income.toLocaleString('en-US')}</div>
    </div>
  ),
  educated: (dynamicData) => (
    <div className={styles.topDataElement}>
      <EducatedPersonIcon size={1} unit="em" />
      <div>{dynamicData.educated}/{dynamicData.educatedWorkers}</div>
    </div>
  ),
  normal: (dynamicData) => (
    <div className={styles.topDataElement}>
      <UneducatedPersonIcon size={1} unit="em" />
      <div>{dynamicData.normal}/{dynamicData.normalWorkers}</div>
    </div>
  ),
}

export { cityInfo };