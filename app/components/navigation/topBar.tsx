"use client";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TopBarProps {
    showArrow?: boolean;
    description?: string;
}
const TopBar: React.FC<TopBarProps> = ({ showArrow = false, description }) => {
    const router = useRouter();
    return (
        <div className="p-4 md:px-14 flex items-center gap-4 md:gap-6 border-b border-gray-300 fixed bg-white  dark:bg-black w-full z-50">
            {showArrow && (
                <MoveLeft className="cursor-pointer" onClick={() => router.back()} />
            )}
          <div className="flex gap-2 items-center">
            <div className="cursor-pointer" onClick={()=>router.replace('/')}>
                <Image src="/images/imperialLogo.png" alt="Imperial Logo" width={40} height={40}   className="w-10 h-10 " />
            </div>
            <div className="grid">
                  <h1 className="text-lg md:text-xl font-bold ">Account Opening</h1>
            {description && <p className="text-sm text-gray-600 -mt-1">{description}</p>}
            </div>
          </div>
        </div>
    );
}

export default TopBar;