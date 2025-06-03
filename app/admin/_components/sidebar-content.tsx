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
    href: "/admin/admindashboard",
  },
  {
    icon: PersonStanding,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: BookOpen,
    label: "Courses",
    href: "/admin/courses",
  },
  {
    icon: Boxes,
    label: "Categories",
    href: "/admin/categories",
  },
  {
    icon: CirclePlus,
    label: "Add Categories",
    href: "/admin/addcategory",
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