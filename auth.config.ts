import type { NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  }, 
  providers:[]
  // Optionally, add more shared settings here like theme, pages, etc.
};

export default authConfig;
