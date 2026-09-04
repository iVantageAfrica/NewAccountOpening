"use client";
import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/app/components/ui/dataTable";
import { useApiEndPoints } from "@/app/hooks/apiEndPoints";
import Spinner from "@/app/components/ui/spinner";
import DashboardStatCard from "@/app/components/ui/dashboardCard";
import { Bell, User } from "lucide-react";
import Modal from "@/app/components/ui/modal";
import { useRouter } from "next/navigation";
import { ComplianceReviewSummary, CustomerAccountState } from "@/app/utils/Utility/Interfaces";
import { getFromLocalStorage } from "@/app/utils/Utility/reUsableFunction";

const CustomerAccount = () => {
  const router = useRouter();
  const { listAllCustomer, loading, customerSummaryList, complianceReviewSummary } = useApiEndPoints();
  const [complianceSummary, setComplianceSummary] = useState<ComplianceReviewSummary | null>(null);
  const adminData = getFromLocalStorage("adminDetails") as Record<string, any> | null;
  const canReviewForCompliance = (adminData?.permissions ?? []).includes("approve-account");
  const [state, setState] = useState<CustomerAccountState>({
    customerList: [],
    summary: {},
    totalRecords: 0,
    currentPage: 1,
    entriesPerPage: 10,
    searchQuery: "",
    nextUrl: null,
    prevUrl: null,
    customerDetails: {},
    customerDetailModal: false,
  });

  const fetchCustomers = useCallback(
    async (page = 1, search = "", perPage = 10, pageUrl?: string) => {
      const { data = [], pagination = {} } = await listAllCustomer(page.toString(), search, perPage.toString(), pageUrl);
      setState((prev) => ({
        ...prev,
        customerList: data,
        totalRecords: pagination.total ?? 0,
        nextUrl: pagination.next_page_url ?? null,
        prevUrl: pagination.prev_page_url ?? null,
      }));
    },
    [listAllCustomer]
  );

  const fetchSummary = useCallback(async () => {
    const summaryResult = await customerSummaryList();
    setState((prev) => ({ ...prev, summary: summaryResult ?? {} }));
  }, [customerSummaryList]);

  useEffect(() => {
    (async () => {
      await fetchSummary();
      if (canReviewForCompliance) {
        const result = await complianceReviewSummary();
        setComplianceSummary(result ?? null);
      }
      const perPage = state.entriesPerPage === "all" ? state.totalRecords || 10 : state.entriesPerPage;
      await fetchCustomers(state.currentPage, state.searchQuery, perPage);
    })();
  }, [state.currentPage, state.searchQuery, state.entriesPerPage,state.totalRecords, fetchSummary, fetchCustomers, canReviewForCompliance, complianceReviewSummary]);

  const handlePageChange = (direction: "next" | "prev") => {
    const perPage = state.entriesPerPage === "all" ? state.totalRecords || 10 : state.entriesPerPage;

    if (direction === "next" && state.nextUrl)
      fetchCustomers(undefined, state.searchQuery, perPage, state.nextUrl);
    if (direction === "prev" && state.prevUrl)
      fetchCustomers(undefined, state.searchQuery, perPage, state.prevUrl);
  };


  return (
    <div>
      <Spinner loading={loading} />

      {canReviewForCompliance && complianceSummary && complianceSummary.total > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 mt-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
              <Bell size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800">Awaiting Your Review</p>
              <p className="text-xs text-amber-700">
                You have {complianceSummary.total} account{complianceSummary.total > 1 ? "s" : ""} awaiting your review.
                {complianceSummary.savings > 0 && ` ${complianceSummary.savings} Savings,`}
                {complianceSummary.current > 0 && ` ${complianceSummary.current} Current,`}
                {complianceSummary.corporate > 0 && ` ${complianceSummary.corporate} Corporate,`}
                {" awaiting compliance review."}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/admin/account-review")}
            className="shrink-0 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 transition-colors"
          >
            Go to Account Review
          </button>
        </div>
      )}

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 mt-4">
        <DashboardStatCard icon={<User />} label="Total Customer" value={state.summary.totalCustomers} />
        <DashboardStatCard icon={<User />} label="This Week" value={state.summary.weeklyCustomers} />
        <DashboardStatCard icon={<User />} label="This Month" value={state.summary.monthlyCustomers} />
        <DashboardStatCard icon={<User />} label="Last Month" value={state.summary.lastMonth} />
      </div>

      {/* Table */}
      <DataTable
        tableTitle="Customer list"
        data={state.customerList}
        columns={[
          { key: "bvn", label: "BVN" },
          { key: "nin", label: "NIN" },
          { key: "firstname", label: "Firstname" },
          { key: "lastname", label: "Lastname" },
          { key: "email", label: "Email" },
          { key: "phoneNumber", label: "Phone Number" },
          { key: "createdAt", label: "Date" },
        ]}
        onRowClick={(row) => setState((prev) => ({ ...prev, customerDetails: row, customerDetailModal: true }))}
        entriesPerPage={state.entriesPerPage}
        nextUrl={state.nextUrl}
        prevUrl={state.prevUrl}
        onPageChange={handlePageChange}
        onSearchChange={(query) =>
          setState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }))
        }
        onLengthChange={(length) =>
          setState((prev) => ({ ...prev, entriesPerPage: length, currentPage: 1 }))
        }
      />


      <Modal
        subTitle=""
        isVisible={state.customerDetailModal}
        title={`${state.customerDetails?.firstname ?? ""} ${state.customerDetails?.lastname ?? ""}`}
        size="sm"
        type="side"
        cancelIcon={true}
        onClose={() => setState((prev) => ({ ...prev, customerDetailModal: false }))}
      >
        <div>
          {[
            ["Firstname", state.customerDetails?.firstname],
            ["Lastname", state.customerDetails?.lastname],
            ["Email", state.customerDetails?.email],
            ["Phone", state.customerDetails?.phoneNumber],
            ["BVN", state.customerDetails?.bvn],
            ["NIN", state.customerDetails?.nin],
            ["Gender", state.customerDetails?.gender],
            ["DOB", state.customerDetails?.dateOfBirth],
            ["Created At", state.customerDetails?.createdAt],
          ].map(([label, value]) => (
            <div key={String(label)} className="grid grid-cols-2 mb-2">
              <span className="opacity-50">{label}</span>
              <span className="font-bold text-black opacity-75">{value ?? "-"}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 py-3 ">
          <p className="font-bold text-black">Account Details</p>
        </div>

        <div className="grid grid-cols-2 mb-2 items-center">
          <span className="opacity-50">Savings Account No</span>
          <div className="flex justify-between items-center">
            <span className="text-black font-bold opacity-75">
              {state.customerDetails?.savingsAccountNumber}
            </span>{
              state.customerDetails?.savingsAccountNumber !== 'N/A' && (
                <span className="bg-primary text-white cursor-pointer rounded p-2" 
                onClick={() => router.replace('/admin/account/individual/?account=' + btoa(state.customerDetails?.savingsAccountNumber ?? '')+'&type='+btoa('Savings'))}>
                  View Details
                </span>
              )
            }
          </div>
        </div>


        <div className="grid grid-cols-2 mb-2 items-center">
          <span className="opacity-50">Current Account No</span>
          <div className="flex justify-between items-center">
            <span className="text-black font-bold opacity-75">
              {state.customerDetails?.currentAccountNumber}
            </span>
            {
              state.customerDetails?.currentAccountNumber !== 'N/A' && (
                <span className="bg-primary text-white cursor-pointer rounded p-2" 
                onClick={() => router.replace('/admin/account/individual/?account=' + btoa(state.customerDetails?.currentAccountNumber ?? '')+'&type='+btoa('Current'))}>
                  View Details
                </span>
              )
            }
          </div>
        </div>

        {/* <div className="grid grid-cols-2 mb-2">
          <span className="opacity-50">Corporate Account</span>
          <span className="text-black font-bold opacity-75">
            {state.customerDetails?.corporateAccountNumber}
          </span>
        </div> */}
      </Modal >
    </div >
  );
};

export default CustomerAccount;