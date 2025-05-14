import Footer from '@/components/footer';
import Header from '@/components/header';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <Header/>
      <SessionProvider> <main>{children}</main></SessionProvider>
    
     <Footer/>
    </div>
  );
};

export default MainLayout;
