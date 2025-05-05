import React from 'react'
import Navbar from './navbar'
import{SessionProvider} from 'next-auth/react'

const Header = () => {
  return (
 <header className='z-40 bg-background/60 backdrop-blur-md fixed top-0 left-0 right-0 border-b '>
  <SessionProvider>
  <div className='container flex h-20 items-center justify-between py-6'>
    <Navbar/>
  </div>
  </SessionProvider>
  
  
 </header>





  )
}

export default Header
