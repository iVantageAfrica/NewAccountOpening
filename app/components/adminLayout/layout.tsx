"use client";
import { Menu } from "lucide-react";
import SideBar from "@/app/components/adminLayout/sideBar";
import React  from "react";
import Image from "next/image";
import { Navigation } from "../../components/adminLayout/navigation";
import { usePathname } from "next/navigation";
import { useAdminGuard } from "../types/administrativeGuard";
import { getFromLocalStorage, timeOfDay } from "@/app/utils/Utility/reUsableFunction";
import { AdminData } from "@/app/utils/Utility/Interfaces";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    useAdminGuard();
    const [collapsed, setIsCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const pathname = usePathname();
    const current = Navigation.find((item) => item.path === pathname);
    const adminData = getFromLocalStorage("adminDetails") as AdminData | null;

    return (
        <div className="flex h-screen">
            <SideBar collapsed={collapsed} 
                     setIsCollapsed={setIsCollapsed} 
                     mobileOpen={mobileOpen} 
                     setMobileOpen={setMobileOpen} />
            <div className="flex-1 overflow-auto bg-linear-to-b from-white to-gray-100 ">

                <div className="md:hidden flex items-center gap-7 px-4 py-5 border-b border-gray-200 fixed w-full bg-white z-50">
                    <Menu size={28} className="cursor-pointer" onClick={() => setMobileOpen(true)} />
                    <h1 className="flex items-center gap-x-2">
                        <Image src="/images/imperialLogo.png" width={35} height={35} alt="Logo" />
                        <div className="grid ">
                            <p className="font-semibold text-lg">Account Opening</p>
                            <p className="text-sm -mt-2">Dashboard</p>
                        </div>
                    </h1>
                </div>

                <div className={` ${collapsed  ? 'md:ml-18': 'md:ml-60'}`}>
                    <div className=" bg-white  pt-5  pb-4 px-4 text-black border-b border-gray-100 hidden md:block fixed z-10 w-full">
                        <div className="grid">
                            <p className="font-bold text-lg">{timeOfDay} {adminData?.firstname}</p>
                            <span className="text-xs text-gray-600 -mt-1 italic ">Here is what happening on Imperial Homes Mortgage Bank account opening</span>
                        </div>
                    </div>
                    <div className="px-4 bg-gray-100 h-screen">
                        <p className="text-gray-500 pt-22 font-bold text-lg">{current?.title}</p>
                        <div className="py-2">
                            {children}
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;