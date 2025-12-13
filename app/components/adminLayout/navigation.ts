import { BookUser, CreditCard, GalleryHorizontalEnd, LayoutDashboard,  User, Users, } from "lucide-react";
import path from "path";
import { title } from "process";

export const Navigation = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customer Information",
    path: "/admin/customer",
    icon: BookUser,
  },
  {
    title: "Savings Account",
    path: "/admin/account/savings",
    icon: User,
  },  
  {
    title: "Current Account",
    path: "/admin/account/current",
    icon: Users,
  },
    {
    title: "Corporate Account",
    path: "/admin/hakd",
    icon: GalleryHorizontalEnd,
  },
  {
    title: "Debit Card Request",
    path: "/admin/card-request",
    icon: CreditCard
  }
];