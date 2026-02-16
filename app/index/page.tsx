"use client";

import AccountTypeCard from "../components/navigation/accountTypeCard";
import TopBar from "../components/navigation/topBar";
import { accountTypes } from "./accountTypes";

const LandingPage = () => {

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />

            <div className="flex-1 pt-24 p-6 md:px-14">
                <h2 className="text-xl md:text-2xl font-bold md:mb-1">Get Started Today</h2>
                <p className="text-xs md:text-sm">
                    Open your account in minutes and enjoy seamless digital banking with Imperial Homes Mortgage
                    Bank.
                </p>

                <div className="grid">
                    <AccountTypeCard accounts={accountTypes} />
                </div>
            </div>

            <footer className="bg-secondary text-center items-center flex flex-col text-xs py-4 gap-2 border-t border-black">
                <p>Copyright © Imperial Homes Mortgage Bank</p>
                <p>
                    Licensed by the Central Bank of Nigeria. All deposits are insured by Nigeria Deposit Insurance
                    Corporation.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;