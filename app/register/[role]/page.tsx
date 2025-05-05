import React from 'react'
import { SignupForm } from '../_components/signup-form'

interface PageProps {
  params: {
    role: string
  }
}

const Page = async({ params }: PageProps) => {

    const role =  params?.role
    console.log(role)
  return (
    <div className='w-full flex h-screen  justify-center items-center '>
      <div className='container'>
        <SignupForm role={role} />
      </div>
    </div>
  ) 
}

export default Page
