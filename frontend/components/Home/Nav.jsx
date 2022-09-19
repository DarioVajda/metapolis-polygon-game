import styles from '../styles/nav.module.css';
import Link from 'next/link';

import PersonIcon from '../universal/icons/PersonIcon';
import ThreeLinesIcon from '../universal/icons/ThreeLinesIcon';
import { useState } from 'react';

const HomeNav = ({connectWallet}) => {
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

const Nav = ({ homeScreen }) => {

  let buttons = [];

  if(homeScreen) {
    buttons = [
      { href: '#roadmap',     text: 'Roadmap'     },
      { href: '#walkthrough', text: 'Walkthrough' },
      { href: '#faqs',        text: 'FAQs'        },
      { href: '#about-us',    text: 'About us'    },
      { href: '/game',        text: 'Game'        },
    ]
  }

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={`${styles.menuBG} ${menuOpen?'':styles.menuBGClosed}`} onClick={() => setMenuOpen(false)}>
        <div className={`${styles.menu} ${menuOpen?'':styles.menuClosed}`}>
          <div>Home</div>
          <div>Leaderboard</div>
          <div>Game</div>
          <div>Profile</div>
          <div>Theme</div>
        </div>
      </div>
      <div className={styles.navbar}>
        <div className={styles.buttonsRow}>
          <div className={styles.menuButton}>
            <ThreeLinesIcon size={1.5} onClick={() => setMenuOpen(!menuOpen)} />
            <Link href='/'>
              <a>City Builder</a>
            </Link>
          </div>
          {
            buttons.map((element, index) => (
              <div key={index} className={styles.button}>
                <Link href={element.href}>
                  <a className={styles.navButton}>{element.text}</a>
                </Link>
              </div>
            ))
          }
          <Link href='/profile'>
            <div className={styles.profile}>
              <span>Profile</span>
              <PersonIcon size={2} />
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Nav