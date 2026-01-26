"use client";

import Modal from "./modal";

type AgreementType = "indemnity" | "terms" | null;

interface AgreementModalsProps {
    activeModal: AgreementType;
    onClose: () => void;
}

const AgreementModals: React.FC<AgreementModalsProps> = ({
    activeModal,
    onClose,
}) => {
    const isVisible = activeModal !== null;
    const pdfUrl = "/file/terms.pdf";

    const titleMap: Record<Exclude<AgreementType, null>, string> = {
        indemnity: "INDEMNITY AGREEMENT",
        terms: "TERMS AND AGREEMENT",
    };

    return (
        <Modal
            isVisible={isVisible}
            onClose={onClose}
            size="md"
            type="side"
            cancelIcon={false}
            title={activeModal ? titleMap[activeModal] : ""}
        >
            <div>


                {/* ================= INDEMNITY AGREEMENT ================= */}
                {activeModal === "indemnity" && (
                    <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-2 pt-2">
                        <p className="font-bold text-black text-sm">
                            Imperial Homes Mortgage Bank
                        </p>
                        <p>
                            By proceeding with this account opening application and accessing
                            any banking services offered by{" "}
                            <span className="font-bold text-black">
                                Imperial Homes Mortgage Bank
                            </span>{" "}
                            (“the Bank”), I/we hereby agree as follows:
                        </p>

                        <p className="font-bold text-black">
                            INDEMNITY & CUSTOMER UNDERTAKINGS
                        </p>

                        <p>
                            I/we authorize the Bank to act on all instructions relating to
                            my/our account(s) received through:
                        </p>

                        <ul className="list-disc list-inside space-y-1">
                            <li>My/our <span className="font-bold text-black">registered email address</span></li>
                            <li>The Bank’s <span className="font-bold text-black">Internet Banking platform</span></li>
                            <li>The Bank’s <span className="font-bold text-black">Mobile Banking application</span></li>
                            <li>Any other <span className="font-bold text-black">electronic channel approved by the Bank</span></li>
                        </ul>

                        <p>
                            I/we acknowledge that the Bank may rely on such instructions
                            <span className="font-bold text-black"> without further verification</span>, provided they originate from
                            my/our registered or authenticated channels.
                        </p>

                        <p>
                            I/we agree to <span className="font-bold text-black">fully indemnify and hold the Bank harmless</span> against
                            any loss, liability, damage, cost, or expense arising from:
                        </p>

                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                Acting on electronic instructions reasonably believed to have
                                been issued by me/us
                            </li>
                            <li>
                                Delays, errors, duplication, or misinterpretation of
                                electronically transmitted instructions
                            </li>
                            <li>
                                Unauthorized transactions resulting from my/our failure to
                                protect login credentials, passwords, PINs, OTPs, tokens, or
                                devices
                            </li>
                            <li>
                                Instructions sent from compromised or unsecured email accounts
                                or devices
                            </li>
                        </ul>

                        <p>I/we accept <span className="font-bold text-black">full responsibility</span> for:</p>

                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                Keeping all passwords, transaction PINs, OTPs, and access
                                credentials <span className="font-bold text-black">confidential</span>
                            </li>
                            <li>
                                Securing my/our email accounts, mobile devices, and digital
                                banking access
                            </li>
                            <li>
                                Promptly notifying the Bank of any suspected fraud, loss, or
                                unauthorized access
                            </li>
                        </ul>

                        <p>
                            I/we understand that the Bank shall not be liable for losses
                            arising from:
                        </p>

                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                My/our negligence or failure to comply with security
                                requirements
                            </li>
                            <li>
                                System failures, network disruptions, or third-party service
                                interruptions
                            </li>
                            <li>
                                Compliance with applicable laws, regulations, or directives
                                issued by regulatory authorities
                            </li>
                        </ul>

                        <p>
                            This indemnity applies to <span className="font-bold text-black">all banking services</span>, including account
                            operations, digital banking services, funds transfers, payments,
                            and service requests.
                        </p>

                        <p>
                            This agreement shall remain <span className="font-bold text-black">valid and binding</span> for the duration of
                            my/our banking relationship with the Bank and shall extend to
                            my/our successors and legal representatives.
                        </p>

                        <p>
                            This indemnity is governed by the
                            <span className="font-bold text-black">
                                {" "}law of the Federal Republic of Nigeria
                            </span>{" "}
                            and applicable <span className="font-bold text-black">CBN regulations.</span>
                        </p>

                        <p className="font-bold text-black pt-2">ACCEPTANCE</p>

                        <p>By selecting <span className="font-bold text-black">“I Agree”</span> and proceeding, I/we confirm that:</p>

                        <ul className="list-disc list-inside space-y-1 pb-4">
                            <li>I/we have read and understood this Indemnity Agreement</li>
                            <li>I/we voluntarily agree to be bound by its terms</li>
                            <li>
                                I/we accept responsibility for instructions issued via approved
                                electronic channels
                            </li>
                        </ul>
                    </div>
                )}

                {/* ================= TERMS PLACEHOLDER ================= */}
                {activeModal === "terms" && (
                    <div className="h-full">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-[80vh] md:h-[85vh] border-none"
                            title="Terms and Conditions"
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AgreementModals;