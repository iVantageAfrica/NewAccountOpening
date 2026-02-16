import Image from "next/image";
import PrimaryButton from "./primaryButton";
import React from "react";
import { useRouter } from "next/navigation";
import { clearAppState } from "@/app/utils/Utility/reUsableFunction";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

interface accountProps {
  url: string;
  accountNumber: string;
  accountType: string;
}

const AccountSuccess: React.FC<accountProps> = ({ url, accountNumber, accountType }) => {
  const router = useRouter();

  const closeModalAndNavigate = () => {
    clearAppState()
    router.push(url);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Image src="/images/success.png" alt="Imperial Logo" width={90} height={40} />
      <p className="text-primary font-bold text-lg md:text-2xl pb-2 pt-3">Congratulations!</p>

      <div className="mx-6 md:mx-18 flex items-center justify-center flex-col text-center">
        <p className="text-black/50 md:text-[16px]">Your new account has been successfully opened.</p>

        <div className="flex gap-4 py-4">
          <p className="text-black/50 md:text-[16px]">
            Account Number: <span className="text-black font-bold">{accountNumber}</span>
          </p>
          <p className="text-black/50 md:text-[16px]">
            Account Type: <span className="text-black font-bold">{accountType} Account</span>
          </p>
        </div>
        <p className="text-black/50 md:text-sm">
          Your default login credentials have been sent to your registered email address. <br />
          Please log in to Internet Banking to create a new password and set your transaction PIN before performing any transactions.

        </p>
        <p className="text-black/50 md:text-sm pt-4"><TriangleAlert size={16} className="inline mr-2 text-red-500" /><span className="font-bold text-black">Security Note, For your protection:</span><br />
          Do not share your password, PIN, OTP, or any sensitive banking information with anyone.
          Imperial Homes staff will never request your PIN, password, or OTP.


        </p>
      </div>

      <div className="my-4 md:w-1/2 border-b border-gray-300 pb-4 md:pb-6">
        <PrimaryButton onClick={closeModalAndNavigate}>
          Login to Internet Banking
        </PrimaryButton>
      </div>

      <div className="flex justify-between items-center gap-4 md:gap-10">
        <Link href={"https://play.google.com/store/apps/details?id=africa.ivantage.app&pcampaignid=web_share"} target="_blank">
          <Image src="/images/googlePlay.png" alt="Google Play" width={110} height={60} className="cursor-pointer" />
        </Link>
        <Link href={"https://apps.apple.com/us/app/imperial/id1644469331"} target="_blank">
          <Image src="/images/appStore.png" alt="App Store" width={110} height={60} className="cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default AccountSuccess;