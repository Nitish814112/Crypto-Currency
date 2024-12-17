import React from 'react'
// importing img
import image from '../images/unique_logo.png'

const Nav = () => {
  return (
    <> 
    {/* Logo */}
       <img  style={{height:"90px",width:"90px",marginLeft:"4%"}}src={image} alt="" />
    </>
  )
}

export default Nav