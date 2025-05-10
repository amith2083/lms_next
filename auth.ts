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
          if (user.role === 'instructor' && user.isVerified === false) {
            // throw new Error("Your instructor account is pending admin approval.");
            console.log('Your instructor account is pending admin approval.')
            return null
          }
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
      console.log('hello')
      console.log("🔁 signIn callback:", { user, account });
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
        }
          
        } catch (error) {
          console.error("❌ Error in Google signIn:", error);
          return false;
        }
        
       
      }
      return true;
    },

    // Called when JWT token is created or updated
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id =  user?.id; // Attach DB ID if available
    //   }
    //   return token;
    // },

    // Controls what gets returned in `useSession`
    // async session({ session, token }) {
    //   if (token) {
    //     session.user.id = token.id as string;
    //   }
    //   return session;
    // },
    // redirect: async ({ url, baseUrl }) => {
    //   try {
    //     const session = await auth(); // make sure you import and call it
    
    //     const user = await User.findOne({ email: session?.user?.email });
    
    //     if (user && !user.role) {
    //       return `${baseUrl}/select-role`;
    //     }
    
    //     return `${baseUrl}/login`;
    //   } catch (error) {
    //     console.error("❌ Error in redirect callback:", error);
    //     return baseUrl;
    //   }
    // }
    
  },
  debug: true,
});
