

import { signIn } from "next-auth/react";


interface SignInResponse {
  user?: any; // Adjust this based on the actual user object structure
  error?: string;
}


const CredentialLogin = async (formData:FormData) => {


  const response :SignInResponse = await signIn('credentials',{
    email:formData.get('email'),
    password:formData.get('password'),
    redirect:false
  })
  console.log('Response from signIn (credentials):', response);

  if (response?.error) {
    console.log('res',response?.error)
    // Show a generic error message to the user
    return { error: "Invalid email or password" };
  }

  return { data: response };
}

export default CredentialLogin
