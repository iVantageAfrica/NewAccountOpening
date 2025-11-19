import Image from "next/image";
import PrimaryButton from "./primaryButton";
import React from "react";
import { useRouter } from "next/navigation";
import { clearAppState } from "@/app/utils/reUsableFunction";

interface accountProps {
  url: string;
  accountNumber: string;
}

const AccountSuccess: React.FC<accountProps> = ({ url, accountNumber }) => {
  const router = useRouter();

  const closeModalAndNavigate = () => {
    clearAppState()
    router.push(url);  
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Image src="/images/success.png" alt="Imperial Logo" width={90} height={40} />
      <p className="text-primary font-bold text-lg md:text-2xl pb-2 pt-6">Congratulations!</p>

      <div className="mx-6 md:mx-18 flex items-center justify-center flex-col text-center">
        <p className="text-black/50 md:text-[16px]">Your new account has been successfully opened.</p>
        <p className="text-black/50 md:text-[16px] md:py-4 py-2">
          Account Number: <span className="text-black font-bold">{accountNumber}</span>
        </p>
        <p className="text-black/50 md:text-[16px]">
          You can now access your account using the default login credentials sent to your registered email address.
        </p>
      </div>

      <div className="my-5 md:w-1/2 border-b border-gray-300 pb-6 md:pb-8">
        <PrimaryButton onClick={closeModalAndNavigate}>
          Login to Internet Banking
        </PrimaryButton>
      </div>

      <div className="flex justify-between items-center gap-4 md:gap-10">
        <Image src="/images/googlePlay.png" alt="Google Play" width={110} height={60} className="cursor-pointer" />
        <Image src="/images/appStore.png" alt="App Store" width={110} height={60} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default AccountSuccess;