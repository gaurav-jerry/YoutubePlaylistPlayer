import React from 'react'
import {HiMenuAlt4} from 'react-icons/hi'
import {RiHeadphoneFill} from 'react-icons/ri'

// import Logo from './images/logo.jpg'

export default function Header() {
    return (
        <div className = 'headerWrapper'>
           <div className = 'logoContainer'><RiHeadphoneFill size={45}/> Gaurav's</div>
           <div><HiMenuAlt4 /></div> 
        </div>
    )
}
