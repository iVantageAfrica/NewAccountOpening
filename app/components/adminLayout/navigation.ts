import { BookCopy, BookUser, CreditCard, GalleryHorizontalEnd,  User, Users, } from "lucide-react";

export const Navigation = [
  // {
  //   title: "Dashboard",
  //   path: "/admin/dashboard",
  //   icon: LayoutDashboard,
  // },
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
    path: "/admin/account/corporate",
    icon: GalleryHorizontalEnd,
  },
      {
    title: "POS Account",
    path: "/admin/account/pos",
    icon: BookCopy,
  },
  {
    title: "Debit Card Request",
    path: "/admin/card-request",
    icon: CreditCard
  }
];