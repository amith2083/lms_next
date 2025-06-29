"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { GraduationCap, Star, ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

// Define the shape of your course data
export interface Category {
  id: string;
  title: string;
 
  status: boolean;
}

// Strongly typed columns array
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  // {
  //   accessorKey: "price",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Price <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const price = parseFloat(row.getValue("price") || "0");
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(price);
  //     return <div>{formatted}</div>;
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Published <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      return (
        <Badge className={cn("bg-gray-500", status && "bg-green-600")}>
          {status ? "Published" : "Unpublished"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/categories/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
            
            {/* <Link href={`/dashboard/courses/${id}/enrollments`}>
              <DropdownMenuItem className="cursor-pointer">
                <GraduationCap className="h-4 w-4 mr-2" />
                View Enrollments
              </DropdownMenuItem>
            </Link> */}
            {/* <Link href={`/dashboard/courses/${id}/reviews`}>
              <DropdownMenuItem className="cursor-pointer">
                <Star className="h-4 w-4 mr-2 fill-primary" />
                View Reviews
              </DropdownMenuItem>
            </Link> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
