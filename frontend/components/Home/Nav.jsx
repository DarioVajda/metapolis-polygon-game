import styles from '../styles/nav.module.css';
import Link from 'next/link';

const Nav = ({connectWallet}) => {
  return (
    <div className={styles.navbar}>
      <Link href="/">
        <a className={`${styles.navButton} ${styles.homeButton}`}>City Builder</a>
      </Link>
      <Link href="#roadmap">
        <a className={styles.navButton}>Roadmap</a>
      </Link>
      <Link href="#walkthrough">
        <a className={styles.navButton}>Walkthrough</a>
      </Link>
      <Link href="#faqs">
        <a className={styles.navButton}>FAQs</a>
      </Link>
      <Link href="#about-us">
        <a className={styles.navButton}>About us</a>
      </Link>
      <Link href="/game">
        <a className={styles.navButton}>Game</a>
      </Link>
      {
        connectWallet?
        <span className={styles.navButton} onClick={connectWallet}>Connect</span>:
        <></>
      }
    </div>
  )
}

export default Nav