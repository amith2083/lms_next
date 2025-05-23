import Logo from "@/components/logo";

import Link from "next/link";
import { SidebarContent } from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Link href="/">
        <Logo />
        </Link> 
      </div>
      <div className="flex flex-col w-full">
        <SidebarContent />
      </div>
    </div>
  );
};

export default Sidebar;