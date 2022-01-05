import React from 'react'
import Link from 'next/link'


export default function Nav() {
    return (
        <nav class="navbar navbar-default navbar-fixed-top nav">
            <div class="container">
                <Link href=""><a><h1>City</h1></a></Link>
                <Link href="#about"><a>About</a></Link>
                <Link href="#faq"><a>FAQ</a></Link>
                <Link href="#contact"><a>Contact us</a></Link>
                <Link href="/game"><a>Game</a></Link>
            </div>
        </nav>
    )
}
