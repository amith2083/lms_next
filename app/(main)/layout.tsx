import Footer from '@/components/footer';
import Header from '@/components/header';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <Header/>
     <main>{children}</main>
     <Footer/>
    </div>
  );
};

export default MainLayout;
