import NextAuth , { NextAuthConfig } from "next-auth";


import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { User } from "./model/user";
import bcrypt from "bcryptjs";

interface Credentials {
  email?: string;
  password?: string;
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [CredentialsProvider({
    async authorize(credentials){
      if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
        throw new Error("Invalid credentials");
      }
      const{email,password}= credentials 
      
      try {
        const user = await User.findOne({email:email})
        if(user && typeof user.password === "string"){
          const isMatch = await bcrypt.compare(password,user.password)
          if (isMatch) {
            return user;
        } else {
            console.error("Password Mismatch");
            throw new Error("Check your password");
        }
        }else{
          console.error("User not found");
          throw new Error("User not found");
        }
        
      } catch (error:any) {
        console.error(error);
        throw new Error(error);
        
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
  
  session: {
    strategy: "jwt",      
    maxAge: 60 * 60 * 24,  // Session lifetime in seconds ( 1 day)
  },
  jwt: {
    maxAge: 60 * 60 * 24, 
  },
  callbacks: {
    // Called whenever a user signs in
    async signIn({ user, account, }) {
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
