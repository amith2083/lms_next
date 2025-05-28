"use client";

import { BarChart } from "lucide-react";

import { BookOpen } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { BookA } from "lucide-react";
import { Radio } from "lucide-react";
import { PersonStanding } from "lucide-react";
import { MessageCircleMore } from "lucide-react";
import { CirclePlus } from "lucide-react";
import { Boxes } from "lucide-react";

const routes = [
  {
    icon: BarChart,
    label: "Analytics",
    href: "/instructor/dashboard",
  },
  
  {
    icon: BookOpen,
    label: "Courses",
    href: "/instructor/courses",
  },
 
  {
    icon: CirclePlus,
    label: "Add Course",
    href: "/instructor/courses/add",
  },
   {
    icon: BookA,
    label: "Quizes",
    href: "/instructor/quiz-sets",
  },
  {
    icon: MessageCircleMore,
    label: "chat",
    href: "/instructor/chat",
  },
 
];

export const SidebarContent = () => {
  // const pathname = usePathname();

  // const isTeacherPage = pathname?.includes("/teacher");

  // const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};