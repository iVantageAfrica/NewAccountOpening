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
                    <div className="text-xs text-gray-500 text-justify leading-relaxed space-y-2 pt-2">
                        <p className="font-bold text-black text-sm">
                            Imperial Homes Mortgage Bank
                        </p>

                        <p className="font-bold text-black">1. INTRODUCTION</p>
                        <p>
                            These Unified Terms and Conditions ("Terms") govern the operation of
                            Individual and Corporate Accounts maintained with{" "}
                            <span className="font-bold text-black">Imperial Homes Mortgage Bank Limited</span>{" "}
                            ("the Bank"). By opening and operating an account with the Bank, the Customer
                            (whether an individual, joint account holder, or corporate entity) agrees to be
                            bound by these Terms as may be amended by the Bank from time to time. Where
                            applicable, specific provisions shall apply distinctly to Individual Accounts
                            or Corporate Accounts. Unless otherwise stated, all clauses apply to both
                            categories.
                        </p>

                        <p className="font-bold text-black">2. ACCOUNT OPENING AUTHORISATION</p>
                        <p>
                            The Customer hereby requests and authorises the Bank to:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Open the account(s) requested; and</li>
                            <li>Subsequently open such further account(s) as the Customer may direct.</li>
                        </ul>
                        <p>
                            The Customer agrees to operate the account(s) in accordance with these Terms
                            and all applicable laws and regulations.
                        </p>

                        <p className="font-bold text-black">3. CUSTOMER OBLIGATIONS</p>
                        <p>The Customer agrees:</p>

                        <p className="font-bold text-black">3.1 Authenticity of Instruments</p>
                        <p>
                            To assume full responsibility for the genuineness, correctness, and validity of
                            all endorsements on cheques, bills, notes, negotiable instruments, receipts,
                            and all other documents relating to the account.
                        </p>

                        <p className="font-bold text-black">3.2 Compliance with Bank Rules</p>
                        <p>
                            To be bound by the Bank’s rules, policies, and procedures governing account
                            operations, electronic banking services, and other related services.
                        </p>

                        <p className="font-bold text-black">3.3 Force Majeure</p>
                        <p>
                            To hold the Bank harmless against any loss or damage arising from government
                            orders, laws, taxes, levies, embargoes, or any circumstances beyond the Bank’s
                            control.
                        </p>

                        <p className="font-bold text-black">3.4 Currency of Payment</p>
                        <p>
                            That all funds standing to the credit of the account shall be payable only in
                            the legal currency in circulation in Nigeria.
                        </p>

                        <p className="font-bold text-black">3.5 Change of Customer Information</p>
                        <p>
                            To promptly notify the Bank in writing of any change in personal, corporate,
                            contact, or operational details supplied at account opening.
                        </p>

                        <p className="font-bold text-black">4. COMMUNICATION & NOTICES</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                Any notice, statement, or correspondence sent to the Customer’s last known
                                physical or electronic address shall be deemed duly delivered.
                            </li>
                            <li>
                                Bank statements shall be sent to the email address provided by the Customer.
                                Any dispute on entries must be communicated in writing within <span className="font-bold text-black">15 days </span>of the
                                statement date, failing which the statement shall be deemed correct.
                            </li>
                        </ul>

                        <p className="font-bold text-black">5. DEPOSITS, INTEREST & CHARGES</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                Interest shall be paid on savings or deposit accounts at rates determined by
                                the Bank, subject to prevailing conditions.
                            </li>
                            <li>
                                The Bank is authorised to debit the account with applicable banking charges,
                                interest on debit balances, commissions and service fees.
                            </li>
                            <li>
                                Any debit balance shall attract interest at rates fixed by the Bank from time
                                to time.
                            </li>
                        </ul>

                        <p className="font-bold text-black">6. CHEQUES & PAYMENTS</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                The Bank shall not be obliged to honour any instruction unless sufficient
                                funds are available.
                            </li>
                            <li>
                                Where an instruction is honoured resulting in an overdraft, the Customer
                                undertakes to repay the amount, together with accrued interest and charges,
                                upon demand.
                            </li>
                            <li>
                                Returned or dishonoured cheques shall attract applicable charges payable by
                                the Customer.
                            </li>
                        </ul>

                        <p className="font-bold text-black">7. SAFEKEEPING & LIABILITY</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                The Customer is responsible for the safekeeping of cheque books, cards,
                                tokens, PINs, and all banking instruments.
                            </li>
                            <li>
                                The Bank accepts no liability for funds handed to staff outside banking hours
                                or outside the Bank’s premises.
                            </li>
                        </ul>

                        <p className="font-bold text-black">8. ELECTRONIC & ALTERNATIVE INSTRUCTIONS</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                The Bank may, at its discretion, accept instructions via email, telephone,
                                scanned documents, text messages, or other electronic means.
                            </li>
                            <li>
                                The Customer acknowledges and assumes all risks associated with instructions
                                given via alternative channels.
                            </li>
                            <li>
                                The Bank reserves the right to refuse or seek further authentication for any
                                instruction without obligation to provide reasons.
                            </li>
                        </ul>

                        <p className="font-bold text-black">9. SET-OFF & CONSOLIDATION</p>
                        <p>
                            The Bank may, without notice, combine or consolidate all accounts maintained by
                            the Customer and set off any credit balance against liabilities owed to the Bank,
                            whether actual or contingent.
                        </p>

                        <p className="font-bold text-black">10. DORMANT ACCOUNTS</p>
                        <p>
                            An account shall be considered dormant where no customer-initiated transaction
                            occurs for a continuous period of two (2) years. Reactivation shall require
                            submission of updated KYC documentation.
                        </p>

                        <p className="font-bold text-black">11. FRAUD, RESTRICTIONS & COMPLIANCE</p>
                        <p>
                            Where fraudulent or suspicious activity is identified, the Bank reserves the right
                            to:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Restrict or freeze the account</li>
                            <li>Report such activity to regulatory or law enforcement agencies</li>
                        </ul>

                        <p className="font-bold text-black">12. ACCOUNT CLOSURE</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                The Bank reserves the right to close or terminate the account relationship where:
                            </li>
                            <li>The account is operated unsatisfactorily</li>
                            <li>The Customer breaches these Terms</li>
                            <li>Regulatory or risk considerations so require</li>
                        </ul>

                        <p className="font-bold text-black">13. SPECIFIC PROVISIONS FOR CORPORATE ACCOUNTS</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                The Corporate Customer confirms that all authorised signatories are duly empowered.
                            </li>
                            <li>
                                The account shall not be used to launder, convert, or hold funds belonging to
                                undisclosed third parties.
                            </li>
                            <li>
                                Changes to mandates or directors must be promptly communicated to the Bank.
                            </li>
                        </ul>

                        <p className="font-bold text-black">14. REQUIRED DOCUMENTATION</p>
                        <p className="font-bold text-black">14.1 Individual Accounts</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Passport photograph(s)</li>
                            <li>Valid means of identification</li>
                            <li>Utility bill (issued within 3 months)</li>
                            <li>Reference form(s)</li>
                            <li>Marriage certificate or change of name publication (where applicable)</li>
                        </ul>

                        <p className="font-bold text-black">14.2 Corporate Accounts</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Passport photographs of signatories</li>
                            <li>Valid identification of signatories and Directors</li>
                            <li>Utility bill(s)</li>
                            <li>Reference forms</li>
                            <li>Board Resolution, Memart, CO7, CO2 etc.</li>
                            <li>Corporate documents as required by regulation (including Scuml certificate where applicable)</li>
                        </ul>

                        <p className="font-bold text-black">15. OTHER THINGS YOU SHOULD KNOW ABOUT THE SERVICES</p>
                        <p className="font-bold text-black">Force Majeure</p>
                        <p>
                            To the fullest extent permitted under applicable law, the Bank shall be excused from
                            performance under these Terms for any period during which it is prevented from or
                            delayed in performing any of its obligations, in whole or in part, as a result of a
                            <span className="text-black"> Force Majeure Event.</span>
                        </p>

                        <p className="font-bold text-black">16. GOVERNING LAW</p>
                        <p className="pb-6">
                            These Terms shall be governed by and construed in accordance with the laws of the <span className="text-black">Federal Republic of Nigeria.</span>
                        </p>

                  
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AgreementModals;