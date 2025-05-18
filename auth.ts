import NextAuth , { NextAuthConfig } from "next-auth";


import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import bcrypt from "bcryptjs";
import { User } from "./model/user";
import authConfig from "./auth.config";


interface Credentials {
  email?: string;
  password?: string;
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [CredentialsProvider({
    async authorize(credentials){
      if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
        throw new Error("Invalid credentials");
      }
      const{email,password}= credentials 
      
      
        const user = await User.findOne({email:email})
        if(user && typeof user.password === "string"){
          const isMatch = await bcrypt.compare(password,user.password)
          if (isMatch) {
            return user;
        } else {
            console.error("Password Mismatch");
            // throw new Error("Check your password");
            
            return null
        }
          //  Add this check for instructor verification
        //   if (user.role === 'instructor' && user.isVerified === false) {
        //     // throw new Error("Your instructor account is pending admin approval.");
        //     console.log('Your instructor account is pending admin approval.')
        //     return null
        //   }
        }else{
          console.error("User not found");
          // throw new Error("User not found");
          return null
        }
        
       
    }
  }),GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization:{
      params:{
        prompt:'consent',
        access_type:'offline',
        response_type:'code'
      }
    }
  })],
  
 
  jwt: {
    maxAge: 60 * 60 * 24, 
  },
  
  callbacks: {
    // Called whenever a user signs in
    async signIn({ user, account, }) {
  
      console.log("🔁 signIn callback:", { user, account });
      if (account?.provider === "credentials") {
        if (!user?.isVerified) {
          console.log(" Instructor pending approval");
          return false; // Custom redirect
        }
      }
      if (account?.provider === "google") {
        try {
          const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create a new user in the database
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            profilePicture: user.image,
            role:null,
            isGoogleUser: true,
          });
          console.log("🆕 Google user created:", newUser.email);
        }else{
            console.log(" Existing user found with Google email:", existingUser.email);
            user.id = existingUser._id.toString(); // Use existing user ID
            user.role = existingUser.role;
            user.isVerified = existingUser.isVerified;
            // Optional: mark Google as auth method if not done before
            if (!existingUser.isGoogleUser) {
              existingUser.isGoogleUser = true;
              await existingUser.save();
            }
        }
          
        } catch (error) {
          console.error(" Error in Google signIn:", error);
          return false;
        }
        
       
      }
      return true;
    },
    async jwt({ token, user }) {
        if (user) {
          console.log('++userithe',user)
          token.id = user._id.toString()
          token.role = user.role;
          token.isVerified = user.isVerified;
        }
        return token;
      },
    
      async session({ session, token }) {
        console.log('token ithe',token)
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.user.isVerified = token.isVerified as boolean;
        }
        return session;
      },

   

   
    
  },
  debug: true,
});