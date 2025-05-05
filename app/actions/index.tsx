'use server'

import { signIn } from '@/auth'
import React from 'react'

const CredentialLogin = async (formData:FormData) => {

 try {
  const response = await signIn('credentials',{
    email:formData.get('email'),
    password:formData.get('password'),
    redirect:false
  })
  return response
 } catch (error:any) {
  throw new Error(error)
 }
}

export default CredentialLogin
