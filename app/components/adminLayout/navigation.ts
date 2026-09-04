import { BookCopy, BookUser, ClipboardCheck, ClipboardList, CreditCard, GalleryHorizontalEnd, Link, Shield, User, UserRound, Users, } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  path: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
  complianceOfficerOnly?: boolean;
}

export const Navigation: NavigationItem[] = [
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
    title: "Reference Portal",
    path: "/admin/reference-portal",
    icon: Link,
  },
  {
    title: "Debit Card Request",
    path: "/admin/card-request",
    icon: CreditCard
  },
  {
    title: "Account Review",
    path: "/admin/account-review",
    icon: ClipboardCheck,
    complianceOfficerOnly: true,
  },
  {
    title: "Admins",
    path: "/admin/admins",
    icon: Shield,
    superAdminOnly: true,
  },
  {
    title: "Audit Logs",
    path: "/admin/audit-logs",
    icon: ClipboardList,
    superAdminOnly: true,
  },
  {
    title: "Profile",
    path: "/admin/profile",
    icon: UserRound,
  }
];