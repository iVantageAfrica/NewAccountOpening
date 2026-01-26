"use client";

import { GalleryHorizontalEnd, User, Users } from "lucide-react";
import { AccountType } from "../components/types/accountType";
import AccountTypeCard from "../components/navigation/accountTypeCard";
import TopBar from "../components/navigation/topBar";

const LandingPage = () => {
    const accountType: AccountType[] = [
        {
            id: 1,
            name: "Current Account",
            category: "Individual",
            code: "101",
            icon: User,
            requirements: [
                "BVN (Bank Verification Number)",
                "NIN (National Identification Number)",
                "One (1) clear passport photograph",
                "Valid means of identification (Driver’s License, International Passport, National Identity Card, or Voter’s Card)",
                "Public utility bill dated within the last three (3) months",
                "Two (2) independent and satisfactory account references",
            ],
        },
        {
            id: 2,
            name: "Savings Account",
            category: "Individual",
            code: "005",
            icon: User,
            requirements: [
                "BVN (Bank Verification Number)",
                "NIN (National Identification Number)",
                " One (1) clear passport photograph",
                "Valid means of identification (Driver's License, International Passport, National Identity Card, or Voter's Card)",
                "Public utility bill dated within the last three (3) months (PHCN bill, water rate bill, tenement rate, rent receipt, or telephone bill)",
            ],
        },
        {
            id: 3,
            name: "Corporate Account",
            category: "Corporate",
            code: "101",
            icon: Users,
            requirements: [
                "Valid means of identification for each Director and Signatory (Driver’s License, International Passport, National Identity Card, or Voter’s Card)",
                "BVN & NIN for each Director and Signatory",
                "One (1) clear passport photograph per Director/Signatory",
                "Public utility bill dated within the last three (3) months",
                "Account References",
                "Two (2) independent and satisfactory account references Directors & Signatories & Referees will receive an email notification to complete a digital KYC form.",
            ],
        },
        {
            id: 4,
            name: "POS Merchant",
            category: "Merchant",
            code: null,
            icon: GalleryHorizontalEnd,
            requirements: [
                "One passport photograph of each signatory showing full face forward, indicating full names and duly signed at the back.",
                "Valid ID for each signatory (e.g. international passport, National Drivers license, National I.D. Card, Permanent Voters Card).",
                "Copy of a utility bill issued within the last three months",
                "Two Reference forms duly completed by an individual or a corporate body maintaining a current account with a bank in Nigeria.",
                "CAC certificate/ TIN / Bord resolution/ Memart etc",
            ],
        },
    ];

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
                    <AccountTypeCard accounts={accountType} />
                </div>
            </div>

            <footer className="bg-secondary text-center items-center flex flex-col text-xs py-4 gap-2 border-t border-black dark:text-black">
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