"use client";
import { Navigation } from "@/app/components/adminLayout/navigation";
import { clearAppState } from "@/app/utils/reUsableFunction";
import { ArrowLeftRight, LassoIcon, LayoutDashboard, SquareDashedBottom, LogOut, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SideBar = ({ collapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
    const pathname = usePathname();
    const router = useRouter();
    const logOut = () =>{
        clearAppState();
        router.replace("/admin/auth")
    }
    return (
        <div className={`
            fixed top-0 left-0 h-screen bg-primary dark:bg-black flex flex-col justify-between
            transition-all duration-300 ease-in-out z-50 border-r border-gray-100
            ${collapsed ? "w-18" : "w-60"}
            ${mobileOpen ? "translate-x-0 w-[60%]" : "-translate-x-full md:translate-x-0 "}
        `}>

            <div>
                <div className="flex gap-2 items-center mt-6  border-b border-white/10 dark:border-gray-100  pb-4 px-4">
                    <div className="cursor-pointer shrink-0">
                        <Image src="/images/imperialLogo.png"  alt="Imperial Logo" width={30} height={30} />
                    </div>

                    <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2"}`}>
                        <h1 className="text-md font-bold whitespace-nowrap text-white">Account Opening</h1>
                        <p className="text-xs text-white -mt-1 whitespace-nowrap ">
                            Administrative Dashboard
                        </p>
                    </div>
                </div>

                <div className="absolute top-13 -right-5 m-2 bg-white rounded-full h-6 w-6 hidden md:flex items-center justify-center shadow cursor-pointer shadow-black">
                    <ArrowLeftRight size={15} className="text-black/70" onClick={() => setIsCollapsed(!collapsed)} />
                </div>

                <div className="absolute top-6 right-1 md:hidden cursor-pointer text-white" onClick={() => setMobileOpen(false)}>
                    <X size={22} />
                </div>


                <div className="mt-8 space-y-3 px-4">
                    {Navigation.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={index}
                                href={item.path}
                                onClick={() => setMobileOpen(false)} 
                                className={`py-2 px-3 rounded text-sm flex items-center gap-3 cursor-pointer transition-all
                duration-200 ease-in-out hover:-translate-y-1 hover:shadow-sm
                ${isActive ? "bg-secondary font-bold text-primary" : "text-white hover:bg-white hover:text-primary"}`}
                            >
                                <Icon size={20} />
                                {!collapsed && item.title}
                            </Link>
                        );
                    })}
                </div>
            </div>


            {/* Logout */}
            <div className="mb-6 px-4 border-t border-white/10 " onClick={logOut}>
                <div className="pt-6 px-3 rounded cursor-pointer text-sm text-white font-bold flex items-center gap-3 transition-all duration-200 ease-in-out  hover:-translate-y-1 ">
                    <LogOut size={20} />
                    {!collapsed && "Logout"}
                </div>
            </div>
        </div >
    );
};

export default SideBar;