import Footer from "@/components/footer";
import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { ReactNode } from "react";
interface DashboardLayoutProps {
  children: ReactNode;
}

const Dashboard = ({ children }:DashboardLayoutProps) => {
  return (
    <div className="h-full">
      <div className="h-[80px] lg:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="lg:pl-56 pt-[80px] h-full">{children}</main>
      
    </div>
  );
};
export default Dashboard;