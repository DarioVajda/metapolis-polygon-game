import styles from '../styles/nav.module.css';
import Link from 'next/link';

import { motion } from 'framer-motion';

import PersonIcon from '../universal/icons/PersonIcon';
import ThreeLinesIcon from '../universal/icons/ThreeLinesIcon';
import { useState } from 'react';

import TwitterIcon from '../universal/icons/TwitterIcon';
import DiscordIcon from '../universal/icons/DiscordIcon';
import InstagramIcon from '../universal/icons/InstagramIcon';

import HomeIcon from '../universal/icons/HomeIcon';
import TrophyIcon2 from '../universal/icons/TrophyIcon2';
import PersonIcon2 from '../universal/icons/PersonIcon2';
import GameIcon from '../universal/icons/GameIcon';

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
    ]
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(true); // true - DARK, false - LIGHT

  const toggleMenuOpen = (open) => {
    setMenuOpen(open)
  }

  const toggleTheme = () => {
    let styles = {};
    let t = !theme;
    styles['--background']            = t ? '#202225'   : '#ebebeb';
    styles['--light-background']      = t ? '#292c30'   : '#b9bcbf';
    styles['--lightest-background']   = t ? '#3b3f46'   : '#adb9cd';
    styles['--text']                  = t ? '#ffffff'   : '#000000';
    styles['--light-text']            = t ? '#999999'   : '#191919';
    styles['--primary']               = t ? '#017DEB'   : '#017DEB';
    styles['--primary-variant']       = t ? '#40a6ff'   : '#40a6ff';
    styles['--primary-dark']          = t ? '#005eb1'   : '#005eb1';
    styles['--primary-bg']            = t ? '#0059a667' : '#0059a667';
    styles['--secondary']             = t ? '#ffba24'   : '#ffba24';
    styles['--secondary-dark']        = t ? '#edaa00'   : '#edaa00';
    styles['--error']                 = t ? '#ff0000'   : '#ff0000';
    styles['--link']                  = t ? '#0000EE'   : '#0000EE';
    styles['--navbar']                = t ? '#04111d'   : '#0084ff';
    styles['--walkthrough-btn']       = t ? '#5f5f5f'   : '#5f5f5f';
    styles['--walkthrough-btn-hover'] = t ? '#707070'   : '#707070';
    styles['--matic']                 = t ? '#9900ff'   : '#9900ff';
    styles['--matic-bg']              = t ? '#5e008a'   : '#5e008a';
    styles['--weth']                  = t ? '#2a6cb8'   : '#2a6cb8';
    styles['--weth-bg']               = t ? '#00346e'   : '#00346e';
    styles['--eth-left2']             = t ? '#ddd'      : '#333';
    styles['--eth-left1']             = t ? '#aaa'      : '#555';
    styles['--eth-left2']             = t ? '#ddd'      : '#333';
    styles['--eth-right2']            = t ? '#888'      : '#666';
    styles['--eth-right1']            = t ? '#555'      : '#999';
    styles['--eth-right2']            = t ? '#888'      : '#666';

    Object.keys(styles).forEach(key => {
      document.documentElement.style.setProperty(key, styles[key]);
    })

    setTheme(!theme);
  }

  return (
    <>
      <div className={`${styles.menuBG} ${menuOpen?'':styles.menuBGClosed}`} onClick={() => toggleMenuOpen(false)}>
        <div className={`${styles.menu} ${menuOpen?'':styles.menuClosed}`} onClick={e => e.stopPropagation()} >
          <div className={styles.menuHomeButton}>
            <Link href='/'><a>
              <HomeIcon />
              Home
            </a></Link>
            <div>
            {
              homeScreen && [ { href: '/', text: 'Mint' }, ...buttons ].map((element, index) => (
                <div key={index}>
                  <Link href={element.href}>
                    <a onClick={() => toggleMenuOpen(false)}>{element.text}</a>
                  </Link>
                </div>
              ))
            }
            </div>
          </div>
          <div>
            <Link href='/leaderboard'><a>
              <TrophyIcon2 />
              Leaderboard
            </a></Link> 
          </div>
          <div> 
            <Link href='/game'><a>
              <GameIcon />
              Game
            </a></Link> 
          </div>
          <div className={styles.profileLink}> 
            <Link href='/profile'><a>
              <PersonIcon2 />
              Profile
            </a></Link> 
          </div>
          <div className={styles.themeButton}>
            <span>
              {theme?'Dark':'Light'} Mode
            </span>
            <button onClick={() => toggleTheme()} className={styles.toggleTheme} style={{ justifyContent: theme?'flex-start':'flex-end' }}>
              <motion.div layout key='toggleTheme' />
            </button>
          </div>
          <div className={styles.links}>
            <a href="https://google.com" target='/blank'>
              <TwitterIcon size={1.5} />
            </a>
            <a href="https://google.com" target='/blank'>
              <DiscordIcon size={1.5} />
            </a>
            <a href="https://google.com" target='/blank'>
              <InstagramIcon size={1.5} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.navbar}>
        <div className={styles.buttonsRow}>
          <div className={styles.menuButton}>
            <ThreeLinesIcon size={1.5} onClick={() => toggleMenuOpen(!menuOpen)} />
            <Link href='/'>
              <a>City Builder</a>
            </Link>
          </div>
          <div className={styles.secondaryButtons}>
          {
            homeScreen && [ ...buttons, { href: '/game', text: 'Game' } ].map((element, index) => (
              <div key={index} className={styles.button}>
                <Link href={element.href}>
                  <a className={styles.navButton}>{element.text}</a>
                </Link>
              </div>
            ))
          }
          </div>
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