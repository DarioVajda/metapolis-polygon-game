import React from 'react'
import Link from 'next/link'
import navStyles from './Nav.module.css'

export default function Nav() {
    return (
        <div className={navStyles["pos"]}>
            <Link href="#top"><a>City</a></Link>
            <Link href="#about"><a>About</a></Link>
            <Link href="#faq"><a>FAQ</a></Link>
            <Link href="#contact"><a>Contact us</a></Link>
            <Link href="/game"><a>Game</a></Link>
        </div>
    )
}
