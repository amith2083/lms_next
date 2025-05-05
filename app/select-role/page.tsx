import React from 'react'
import SelectRolePage from './_components/rolepage'
import { SessionProvider } from 'next-auth/react'

const page = () => {
  return (
    <>
    <SessionProvider>  <SelectRolePage/></SessionProvider>
  </>
      
    
  )
}

export default page
