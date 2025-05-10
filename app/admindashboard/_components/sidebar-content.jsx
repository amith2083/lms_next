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
    href: "/admindashboard",
  },
  {
    icon: PersonStanding,
    label: "Users",
    href: "/admindashboard/users",
  },
  {
    icon: BookOpen,
    label: "Courses",
    href: "/admindashboard/courses",
  },
  {
    icon: Boxes,
    label: "Categories",
    href: "/admindashboard/categories",
  },
  {
    icon: CirclePlus,
    label: "Add Categories",
    href: "/admindashboard/category/add",
  },
  {
    icon: MessageCircleMore,
    label: "chat",
    href: "/dashboard/chat",
  },
//   {
//     icon: BookA,
//     label: "Quizes",
//     href: "/dashboard/quiz-sets",
//   },
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