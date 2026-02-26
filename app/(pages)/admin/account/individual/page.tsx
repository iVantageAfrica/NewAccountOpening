"use client";
import InformationText from "@/app/components/ui/informationText";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { downloadIndemnityForm } from "@/app/utils/formDownload/indemnityForm";
import { downloadIndividualAccountForm } from "@/app/utils/formDownload/individualAccount";
import { IndividualAccountData } from "@/app/utils/Utility/Interfaces";
import { cryptoHelper, formatDate } from "@/app/utils/Utility/reUsableFunction";
import { Ban, BookUser, Clock, Download, File, User, UserLock, View } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function IndividualAccountContent()  {
    const { loading, fetchIndividualAccount } = useApiEndPoints();
    const param = useSearchParams();
    const accountNumber = atob(param.get("account") || "");
    const accountType = atob(param.get("type") || "");
    const [state, setState] = React.useState<{ accountInformation: IndividualAccountData }>({
        accountInformation: {}
    })

    React.useEffect(() => {
        (async () => {
            const accountData = await fetchIndividualAccount(accountNumber);
            setState((prev) => ({
                ...prev,
                accountInformation: accountData
            }))
        })();
    }, [accountNumber, fetchIndividualAccount]);

    const copyReferenceLink = async () => {
        const url = new URL(
            "/verification/reference-creation",
            window.location.origin
        );
        url.searchParams.set("acc", cryptoHelper.encrypt(accountNumber) ?? "");
        url.searchParams.set("accType", cryptoHelper.encrypt(accountType) ?? "");
        url.searchParams.set(
            "accName",
            cryptoHelper.encrypt(
                `${state.accountInformation?.lastname ?? ""} ${state.accountInformation?.firstname ?? ""}`.trim()
            ) ?? ""
        );
        await navigator.clipboard.writeText(url.toString());
        alert("Reference URL Copied!");
    };

    return (
        <div>
            <Spinner loading={loading} />
            <div className="flex -mt-1 gap-8 flex-col md:flex-row">
                <div className="w-full md:w-[70%] bg-white px-4 md:px-8 py-4 rounded order-2 md:order-1">
                    <div className="flex justify-between flex-col md:flex-row mb-6">
                        <p className="font-bold text-lg">{accountType} Account</p>
                        <div className="grid">
                            <p className="text-xs"><span className="text-primary font-bold">Status: </span> {state.accountInformation?.status}</p>
                            <p className="text-xs w-full flex gap-1 items-center opacity-75"><Clock size={12} />{state.accountInformation?.createdAt}</p>
                        </div>
                    </div>
                    <div id="accountPdfWrapper">
                        <div className="flex justify-between flex-col md:flex-row gap-y-4">
                            <div className="gap-2 flex items-center">
                                <div className="bg-white border-gray-300 border-2 p-2 rounded-full text-gray-400"><User size={15} /> </div>
                                <div className="grid">
                                    <p className="text-sm opacity-75">Fullname</p>
                                    <p className="font-bold text-sm opacity-80 capitalize">{state.accountInformation?.lastname} {state.accountInformation?.middleName} {state.accountInformation?.firstname}</p>
                                </div>
                            </div>
                            <div className="gap-2 flex items-center">
                                <div className="bg-white border-gray-300 border-2 p-2 rounded-full text-gray-400"><BookUser size={15} /> </div>
                                <div className="grid">
                                    <p className="text-sm opacity-75">Account Number</p>
                                    <p className="font-bold text-sm opacity-75">{state.accountInformation?.accountNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Account Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mt-3">
                            <InformationText title="Firstname" data={state.accountInformation?.firstname} />
                            <InformationText title="Middlename" data={state.accountInformation?.middleName} />
                            <InformationText title="Lastname" data={state.accountInformation?.lastname} />
                            <InformationText title="BVN" data={state.accountInformation?.bvn} />
                            <InformationText title="NIN" data={state.accountInformation?.nin} />
                            <InformationText title="Gender" data={state.accountInformation?.gender} />
                            <InformationText title="Date of Birth" data={formatDate(state.accountInformation?.dateOfBirth)} />
                            <InformationText title="Phone Number" data={state.accountInformation?.phoneNumber} />
                            <InformationText title="Email Address" data={state.accountInformation?.email} />
                            <InformationText title="Request Debit Card" data={state.accountInformation?.debitCard ? 'YES' : 'NO'} />
                        </div>
                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Personal Information
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mt-3">
                            <InformationText title="Mother Maiden Name" data={state.accountInformation?.motherMaidenName} />
                            <InformationText title="Current Phone Number" data={state.accountInformation?.mobilePhoneNumber} />
                            <InformationText title="Marital Status" data={state.accountInformation?.maritalStatus} />
                            <InformationText title="Employment Status" data={state.accountInformation?.employmentStatus} />
                            <InformationText title="Employer" data={state.accountInformation?.employer} />
                            <InformationText title="State of Origin" data={state.accountInformation?.origin} />
                            <InformationText title="Local Government" data={state.accountInformation?.lga} />
                            <InformationText title="Current House Address" data={state.accountInformation?.address} />
                            <InformationText title="Next of Kin" data={state.accountInformation?.nextOfKinName} />
                            <InformationText title="Next of Kin Relationship" data={state.accountInformation?.nextOfKinRelationship} />
                            <InformationText title="Next of Kin Phone" data={state.accountInformation?.nextOfKinPhoneNumber} />
                            <InformationText title="Next of Kin Address" data={state.accountInformation?.nextOfKinAddress} />
                            <InformationText title="Account Officer" data={state.accountInformation?.accountOfficer} />
                        </div>

                        {
                            accountType === 'Current' && (
                                <>
                                    <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                                        Bank Account Reference
                                    </div>
                                    {state.accountInformation?.referee?.length && state.accountInformation.referee.length > 0
                                        ?
                                        (
                                            <>
                                                <p
                                                    className="text-xs text-right text-primary font-bold cursor-pointer px-4 pt-2"
                                                    onClick={copyReferenceLink}
                                                >
                                                    New Reference Link
                                                </p>

                                                {state.accountInformation.referee.map((ref, index) => (
                                                    <div key={index}>
                                                        <p className="pl-4 font-bold text-xs pt-4">
                                                            Referee {index + 1}
                                                        </p>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 px-4">
                                                            <InformationText title="Name" data={ref?.name} />
                                                            <InformationText title="Mobile" data={ref?.mobileNumber} />
                                                            <InformationText title="Email" data={ref?.emailAddress} />
                                                            <InformationText title="Bank Name" data={ref?.bankName || "Not Yet Submitted"} />
                                                            <InformationText title="Account Name" data={ref?.accountName || "Not Yet Submitted"} />
                                                            <InformationText title="Account Number" data={ref?.accountNumber || "Not Yet Submitted"} />
                                                            <InformationText title="Account Type" data={ref?.accountType || "Not Yet Submitted"} />
                                                            <InformationText title="Known Period" data={ref?.knownPeriod || "Not Yet Submitted"} />
                                                            <InformationText title="Comment" data={ref?.comment || "Not Yet Submitted"} />
                                                            <InformationText
                                                                title="Signature"
                                                                data={ref?.signature || "Not Yet Submitted"}
                                                                type="file"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )
                                        : (
                                            <div className="flex justify-between">
                                                <p className="font-bold text-red-500 pl-5 text-sm">
                                                    Not Yet Submitted
                                                </p>
                                                <p
                                                    className="text-xs text-right text-primary font-bold cursor-pointer px-4 pt-2"
                                                    onClick={copyReferenceLink}
                                                >
                                                    New Reference Link
                                                </p>
                                            </div>
                                        )

                                    }
                                </>
                            )
                        }


                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Documents
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mt-3">
                            <InformationText title="Passport" data={state.accountInformation?.documents?.passport || "Not Submitted"} type="file" />
                            <InformationText title="Valid Id" data={state.accountInformation?.documents?.validId || "Not Submitted"} type="file" />
                            <InformationText title="Signature" data={state.accountInformation?.documents?.signature || "Not Submitted"} type="file" />
                            <InformationText title="Utility Bill" data={state.accountInformation?.documents?.utilityBill || "Not Submitted"} type="file" />
                        </div>
                    </div>

                </div>
                <div className="w-full md:w-[30%] order-1 md:order-2 mt-4 md:mt-0">
                    <p className="bg-primary text-white rounded p-2 font-bold text-center items-center">Actions & Operations</p>
                    <div className="pt-4 ps-3 grid gap-3">
                        <p onClick={() => downloadIndividualAccountForm(state.accountInformation, accountType)} className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center hover:text-primary"><Download size={15} /> Download Information</p>
                        <p
                            onClick={() => downloadIndemnityForm({
                                firstname: state.accountInformation?.firstname,
                                lastname: state.accountInformation?.lastname,
                                middleName: state.accountInformation?.middleName,
                                email: state.accountInformation?.email,
                                signature: state.accountInformation?.documents?.signature,
                                accountNumber: state.accountInformation?.accountNumber
                            })}
                            className="inline-flex gap-3 cursor-pointer text-sm items-center hover:text-primary"
                        >
                            <File size={15} />
                            Download Indemnity Form
                        </p>
                        <p className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center hover:text-primary"><View size={15} /> Review Account</p>
                        <p className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center hover:text-primary "><Ban size={15} /> Deactivate Account </p>
                        <p className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center text-primary hover:text-black "><UserLock size={15} /> Activate PND</p>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default function IndividualAccount() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account reference...</div>}>
            <IndividualAccountContent />
        </Suspense>
    );
}