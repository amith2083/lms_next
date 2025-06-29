"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, BookOpenCheck, LogOut } from "lucide-react";

const menu = [
  { label: "Profile", href: "/account", icon: <User className="w-4 h-4 mr-2" /> },
  {
    label: "Enrolled Courses",
    href: "/account/enrolled-courses",
    icon: <BookOpenCheck className="w-4 h-4 mr-2" />,
  },
];

function Menu() {
  const pathname = usePathname();

  return (
    <ul className="space-y-2 text-sm font-medium">
      {menu.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        );
      })}

      <li>
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-3 py-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </li>
    </ul>
  );
}

export default Menu;
