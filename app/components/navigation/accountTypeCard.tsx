"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, CircleCheck } from "lucide-react";
import { AccountType } from "../../index/accountType";
import PrimaryButton from "../ui/primaryButton";
import { useRouter } from "next/navigation";

interface Props {
  accounts: AccountType[];
}

export default function AccountTypeCard({ accounts }: Props) {
  const router = useRouter();

  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.category]) acc[account.category] = [];
    acc[account.category].push(account);
    return acc;
  }, {} as Record<string, AccountType[]>);

  const categories = Object.keys(groupedAccounts);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || "");
  const firstAccountId = accounts[1]?.id || null;
  const [openAccountId, setOpenAccountId] = useState<number | null>(firstAccountId);

  const continueHandler = (selectedAccount: AccountType) => {
    const selectedAccountData = JSON.stringify({
      id: selectedAccount.id,
      name: selectedAccount.name,
      category: selectedAccount.category,
      code: selectedAccount.code,
    });
    router.push(`/verification?account=${btoa(selectedAccountData)}`);
  };

  return (
    <div>
      <div className="rounded-md grid gap-y-2 border border-gray-300 p-4 mt-6 lg:hidden">
        {categories.map((category, idx) => {
          const Icon = groupedAccounts[category][0].icon;
          const isActive = activeCategory === category;

          return (
            <div key={idx} className="flex">
              <div
                className={`flex items-center gap-2 px-6 py-3 w-full rounded-md cursor-pointer transition-all duration-200 ${isActive
                    ? "bg-primary text-white"
                    : "text-black "
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {Icon && <Icon size={15} />}
                <h3 className="text-sm font-semibold">{category}</h3>
              </div>
            </div>
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-14 gap-10 md:mt-14 mt-6">
        {Object.entries(groupedAccounts).map(([category, group]) => {
          const isMobileVisible = activeCategory === category;
          const isMulti = group.length > 1;
          const Icon = group[0].icon;

          return (
            <div
              key={category}
              className={`cursor-pointer ${!isMobileVisible ? "hidden lg:block" : ""}`}
            >

              <div className="bg-primary text-white lg:flex items-center gap-3 px-8 py-3 md:rounded-t-2xl hidden">
                {Icon && <Icon size={18} />}
                <h3 className="text-lg font-semibold">{category}</h3>
              </div>


              <div className="p-4 border border-gray-300 rounded-md md:rounded-b-2xl md:rounded-t-none gap-y-4 grid">
                <p className="text-lg font-bold block md:hidden">
                  Select an account type below
                </p>
                {group.map((account) => {
                  const isOpen = openAccountId === account.id || !isMulti;
                  const isDisabled = account.id === 3

                  return (
                    <div key={account.id} className="overflow-hidden">
                      <div
                        className={`px-10 py-3 font-bold flex justify-between items-center transition-all duration-200 ${isMulti
                            ? isOpen
                              ? "bg-secondary text-primary rounded-t-md"
                              : "border-2 border-primary text-black  rounded-md"
                            : "bg-secondary text-primary rounded-t-md"
                          }`}
                        onClick={() =>
                          isMulti
                            ? setOpenAccountId(isOpen ? null : account.id)
                            : undefined
                        }
                      >
                        <p className="text-sm">{account.name}</p>
                        {isMulti && (
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                              }`}
                          />
                        )}
                      </div>

                      {/* Account requirements */}
                      {isOpen && (
                        <>
                          <div className="p-4 border border-gray-200 rounded-b-md">
                            <p className="font-bold text-xs mb-1">
                              Minimum Requirements:
                            </p>
                            <ul className="text-xs ml-1.5 gap-y-1.5 grid">
                              {account.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start text-[11px]">
                                  <CircleCheck
                                    size={12}
                                    className="mr-2 text-primary shrink-0 "
                                  />
                                  {req}
                                </li>
                              ))}
                            </ul>
                            {isMulti ? (
                              <>
                                <p className="font-bold text-xs mb-1 py-2 flex items-center cursor-pointer" onClick={() => continueHandler(account)}>Product Features <ChevronDown size={15} className="text-primary"/></p>
                              <div className="flex w-1/2 mt-4 mb-2">
                                <PrimaryButton
                                  icon={<ArrowRight size={15} />}
                                  onClick={() => continueHandler(account)}
                                >
                                  Continue
                                </PrimaryButton>
                              </div>
                              </>
                            ) : (
                              <>
                                <p className="font-bold text-xs mb-1 py-2 flex items-center cursor-pointer" onClick={() => continueHandler(account)}>Product Features <ChevronDown size={15} className="text-primary"/></p>
                                <div className="flex w-1/2 mt-4 mb-2">

                                  <PrimaryButton
                                    icon={<ArrowRight size={15} />}
                                    disabled={isDisabled}
                                    onClick={() => continueHandler(account)}
                                  >
                                    Continue
                                  </PrimaryButton>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}