"use client";
import InformationText from "@/app/components/ui/informationText";
import Spinner from "@/app/components/ui/spinner";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import { downloadCorporateAccountForm } from "@/app/utils/formDownload/corporateAccount";
import { downloadIndemnityForm } from "@/app/utils/formDownload/indemnityForm";
import { CorporateAccount } from "@/app/utils/Utility/Interfaces";
import { cryptoHelper, formatDate, formatTitle, toCamelCase } from "@/app/utils/Utility/reUsableFunction";
import { ACCOUNT_TYPE_DOCUMENTS, DOCUMENT_META } from "@/app/utils/validationSchema/companyDocumentSchema";
import { getSignatoryFields } from "@/app/utils/validationSchema/directorySignatorySchema";
import { Ban, BookUser, Clock, Download, File, User, UserLock, View } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function FetchCorporateContent() {
    const { loading, fetchCorporateAccount } = useApiEndPoints();
    const param = useSearchParams();
    const accountNumber = atob(param.get("account") || "");
    const accountType = atob(param.get("type") || "");
    const [accountInformation, setAccountInformation] = React.useState<CorporateAccount | null>(null);
    React.useEffect(() => {
        (async () => {
            const accountData = await fetchCorporateAccount(accountNumber);
            setAccountInformation(accountData);
        })();
    }, [accountNumber, fetchCorporateAccount]);

    const companyType = accountInformation?.companyTypeId;
    const companyDocuments = accountInformation?.companyDocument || {};

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
                    `${accountInformation?.companyName ?? ""}`.trim()
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
                            <p className="text-xs"><span className="text-primary font-bold">Status: </span> {accountInformation?.status}</p>
                            <p className="text-xs w-full flex gap-1 items-center opacity-75"><Clock size={12} />{accountInformation?.createdAt}</p>
                        </div>
                    </div>
                    <div id="accountPdfWrapper">
                        <div className="flex justify-between flex-col md:flex-row gap-y-4">
                            <div className="gap-2 flex items-center">
                                <div className="bg-white border-gray-300 border-2 p-2 rounded-full text-gray-400"><User size={15} /> </div>
                                <div className="grid">
                                    <p className="text-sm opacity-75">Company Name</p>
                                    <p className="font-bold text-sm opacity-80 capitalize"> {accountInformation?.companyName}</p>
                                </div>
                            </div>
                            <div className="gap-2 flex items-center">
                                <div className="bg-white border-gray-300 border-2 p-2 rounded-full text-gray-400"><BookUser size={15} /> </div>
                                <div className="grid">
                                    <p className="text-sm opacity-75">Account Number</p>
                                    <p className="font-bold text-sm opacity-75">{accountInformation?.accountNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Account Information
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-3">
                            <InformationText title="Firstname" data={accountInformation?.firstname} />
                            <InformationText title="Middlename" data={accountInformation?.middleName} />
                            <InformationText title="Lastname" data={accountInformation?.lastname} />
                            <InformationText title="BVN" data={accountInformation?.bvn} />
                            <InformationText title="NIN" data={accountInformation?.nin} />
                            <InformationText title="Gender" data={accountInformation?.gender} />
                            <InformationText title="Date of Birth" data={formatDate(accountInformation?.dateOfBirth)} />
                            <InformationText title="Phone Number" data={accountInformation?.phoneNumber} />
                            <InformationText title="Email Address" data={accountInformation?.email} />
                            <InformationText title="Request Debit Card" data={accountInformation?.debitCard ? 'YES' : 'NO'} />
                        </div>
                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Company Information
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mt-3">
                            <InformationText title="Company Name" data={accountInformation?.companyName} />
                            <InformationText title="Registration Number" data={accountInformation?.registrationNumber} />
                            <InformationText title="TIN" data={accountInformation?.tin} />
                            <InformationText title="Company Type" data={accountInformation?.companyType} />
                            <InformationText title="Business Phone Number" data={accountInformation?.phoneNumber} />
                            <InformationText title="Business Email" data={accountInformation?.businessEmail} />
                            <InformationText title="City" data={accountInformation?.city} />
                            <InformationText title="State" data={accountInformation?.state} />
                            <InformationText title="Local Government" data={accountInformation?.lga} />
                            <InformationText title="Address" data={accountInformation?.companyAddress} />
                            <InformationText title="Account Officer" data={accountInformation?.accountOfficer} />
                        </div>

                        {accountInformation?.directory &&
                            accountInformation.directory.length > 0 && (
                                <>
                                    <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                                        Directors
                                    </div>
                                    {accountInformation.directory.map((director, index) => (
                                        <div key={director.id ?? index}>
                                            <p className="pl-4 font-bold text-xs py-2">
                                                Director {index + 1}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 px-4">
                                                <InformationText
                                                    title="Full Name"
                                                    data={`${director.firstname} ${director.othername ?? ''} ${director.lastname}`}
                                                />
                                                <InformationText title="Email" data={director.emailAddress} />
                                                <InformationText title="Phone" data={director.phoneNumber} />
                                                <InformationText title="BVN" data={director.bvn} />
                                                <InformationText title="NIN" data={director.nin} />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 px-4 mt-2 text-xs">
                                                {Object.entries(director)
                                                    .filter(([key]) =>
                                                        ![
                                                            'firstname',
                                                            'othername',
                                                            'lastname',
                                                            'emailAddress',
                                                            'phoneNumber',
                                                            'bvn',
                                                            'nin',
                                                            'id'
                                                        ].includes(key)
                                                    )
                                                    .map(([key, value]) => {
                                                        const isFile = typeof value === 'string' && value.startsWith('http');

                                                        return (
                                                            <div key={key}>
                                                                <p className="font-medium opacity-75">
                                                                    {formatTitle(key)}
                                                                </p>

                                                                {isFile ? (
                                                                    <InformationText
                                                                        title=""
                                                                        data={value}
                                                                        type="file"
                                                                    />
                                                                ) : (
                                                                    <p className="text-red-500 font-bold">
                                                                        NOT YET SUBMITTED
                                                                    </p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}


                        {accountInformation?.signatory &&
                            accountInformation.signatory.length > 0 && (
                                <>
                                    <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                                        Signatories
                                    </div>

                                    {accountInformation.signatory.map((signatory, index) => {
                                        const requiredFields = getSignatoryFields(String(companyType ?? ""));
                                        return (
                                            <div key={signatory.id ?? index}>
                                                <p className="pl-4 font-bold text-xs py-2">
                                                    Signatory {index + 1}
                                                </p>

                                                {/* Basic Info */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 px-4">
                                                    <InformationText title="Name" data={signatory.name} />
                                                    <InformationText title="Email" data={signatory.emailAddress} />
                                                    <InformationText title="Phone" data={signatory.phoneNumber} />
                                                    <InformationText title="BVN" data={signatory.bvn} />
                                                    <InformationText title="NIN" data={signatory.nin} />
                                                </div>

                                                {/* Required + Optional Files Based On Company Type */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 px-4 mt-2">
                                                    {requiredFields.map((field) => {
                                                        const camelKey = toCamelCase(field.name);
                                                        const value = signatory?.[camelKey];
                                                        return (
                                                            <div key={field.name}>
                                                                <InformationText title={field.label} data={String(value) || "Not Yet Submitted"} type="file" />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Bank Account Reference
                        </div>

                        {/* {accountInformation?.referee?.length ? (
                            accountInformation.referee.map((ref, index) => (
                                <div key={index}>
                                    <p className="pl-4 font-bold text-xs py-2">Referee {index + 1}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 px-4">
                                        <InformationText title="Name" data={ref?.name} />
                                        <InformationText title="Mobile" data={ref?.mobileNumber} />
                                        <InformationText title="Email" data={ref?.emailAddress} />
                                        <InformationText title="Bank Name" data={ref?.bankName || "Not Yet Submitted"} />
                                        <InformationText title="Account Name" data={ref?.accountName || "Not Yet Submitted"} />
                                        <InformationText title="Account Number" data={ref?.accountNumber || "Not Yet Submitted"} />
                                        <InformationText title="Account Type" data={ref?.accountType || "Not Yet Submitted"} />
                                        <InformationText title="Known Period" data={ref?.knownPeriod || "Not Yet Submitted"} />
                                        <InformationText title="Comment" data={ref?.comment || "Not Yet Submitted"} />
                                        <InformationText title="Signature" data={ref?.signature || "Not Yet Submitted"} type="file" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="font-bold text-red-500 pl-5">Not Yet Submitted</p>
                        )} */}


                        {accountInformation?.referee?.length && accountInformation.referee.length > 0
                            ?
                            (
                                <>
                                    <p
                                        className="text-xs text-right text-primary font-bold cursor-pointer px-4 pt-2"
                                        onClick={copyReferenceLink}
                                    >
                                        New Reference Link
                                    </p>

                                    {accountInformation.referee.map((ref, index) => (
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

                        <div className="bg-gray-100 text-black/70 rounded w-full px-4 py-1 text-sm font-bold mt-8">
                            Company Documents Submitted
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mt-3">
                            {companyType && ACCOUNT_TYPE_DOCUMENTS[Number(companyType)]?.length > 0 ? (

                                ACCOUNT_TYPE_DOCUMENTS[Number(companyType)].map((docKey) => {
                                    const camelKey = toCamelCase(docKey);
                                    const value = companyDocuments?.[camelKey];

                                    const isFile =
                                        typeof value === "string" && value.startsWith("http");

                                    const meta = DOCUMENT_META[docKey];

                                    return (
                                        <InformationText
                                            key={docKey}
                                            title={meta?.label || docKey}
                                            data={isFile ? value : "NOT YET SUBMITTED"}
                                            type={isFile ? "file" : "text"}
                                        />
                                    );
                                })

                            ) : (
                                <p className="font-bold text-red-500 pl-5 -mt-2">
                                    Not Yet Submitted
                                </p>
                            )}
                        </div>
                    </div>

                </div>
                <div className="w-full md:w-[30%] order-1 md:order-2 mt-4 md:mt-0">
                    <p className="bg-primary text-white rounded p-2 font-bold text-center items-center">Actions & Operations</p>
                    <div className="pt-4 ps-3 grid gap-3">
                        <p onClick={() => downloadCorporateAccountForm(accountInformation, accountType)} className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center hover:text-primary"><Download size={15} /> Download Information</p>         <p
                            onClick={() => downloadIndemnityForm({
                                firstname: accountInformation?.firstname,
                                lastname: accountInformation?.lastname,
                                email: accountInformation?.email,
                                signature: accountInformation?.documents?.signature,
                                companyName: accountInformation?.companyName,
                                accountNumber: accountInformation?.accountNumber
                            })}
                            className="inline-flex gap-3 cursor-pointer text-sm items-center hover:text-primary"
                        >
                            <File size={15} />
                            Download Indemnity Form
                        </p>
                        <p className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center hover:text-primary"><View size={15} /> Review Account</p>
                        <p className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center hover:text-primary "><Ban size={15} /> Deactivate Account </p>
                        <p className="inline-flex gap-3 cursor-pointer text-sm overflow-none items-center text-primary hover:text-black"><UserLock size={15} /> Activate PND</p>
                    </div>
                </div>
            </div>
        </div >
    );
}


export default function FetchCorporate() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading account reference...</div>}>
            <FetchCorporateContent />
        </Suspense>
    );
}