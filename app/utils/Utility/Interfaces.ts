export interface BvnData {
  bvn: string;
  nin: string;
  gender?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emailAddress?: string;
}

export interface Director {
  id?: string | number;
  firstname?: string;
  othername?: string;
  lastname?: string;
  emailAddress?: string;
  phoneNumber?: string;
  bvn?: string;
  nin?: string;
  [key: string]: string | number | undefined;
}

export interface Signatory {
  id?: string | number;
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
  bvn?: string;
  nin?: string;
  [key: string]: string | number | undefined;
}

export interface Referee {
  name?: string;
  mobileNumber?: string;
  emailAddress?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  knownPeriod?: string;
  comment?: string;
  signature?: string;
}

export interface CompanyDocuments {
  [key: string]: string | undefined;
}

export interface CorporateAccount {
  id?: string | number;
  firstname?: string;
  middleName?: string;
  lastname?: string;
  bvn?: string;
  nin?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  email?: string;
  debitCard?: boolean;
  companyName?: string;
  registrationNumber?: string;
  tin?: string;
  companyType?: string;
  companyTypeId?: string | number;
  businessEmail?: string;
  city?: string;
  state?: string;
  lga?: string;
  companyAddress?: string;
  accountOfficer?: string;
  accountNumber?: string;
  status?: string;
  createdAt?: string;
  directory?: Director[];
  signatory?: Signatory[];
  referee?: Referee[];

  companyDocument?: CompanyDocuments;

  documents?: {
    signature?: string;
    [key: string]: string | undefined;
  };
}

export interface DashboardSummary {
  totalAccount?: string;
  approvedAccount?: string;
  awaitingAccount?: string;
  pendingAccount?: string;
}

export interface CorporateAccountState {
  customerCorporateAccount: [];
  dashboardSummary: DashboardSummary;
  totalRecords: number;
  currentPage: number;
  entriesPerPage: number | "all";
  searchQuery: string;
  nextUrl: string | null;
  prevUrl: string | null;
}

export interface CustomerCorporateAccount {
  accountNumber: string;
  companyName: string;
  companyType: string;
  tin: string;
  registrationNumber: string;
  city: string;
  status: string;
  createdAt: string;
}


export interface CustomerCurrentAccount {
  accountNumber: string;
  bvn: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
}



export interface CurrentAccountState {
  customerCurrentAccount: [];
  dashboardSummary: DashboardSummary;
  totalRecords: number;
  currentPage: number;
  entriesPerPage: number | "all";
  searchQuery: string;
  nextUrl: string | null;
  prevUrl: string | null;
}


export interface IndividualAccountData {
  firstname?: string;
  lastname?: string;
  middleName?: string;
  bvn?: string;
  nin?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  email?: string;
  debitCard?: boolean;
  accountNumber?: string;
  status?: string;
  motherMaidenName?: string;
  mobilePhoneNumber?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  employer?: string;
  origin?: string;
  lga?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinAddress?: string;
  accountOfficer?: string;
  createdAt?: string,
  referee?: {
    name?: string;
    mobileNumber?: string;
    emailAddress?: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    accountType?: string;
    knownPeriod?: string;
    comment?: string;
    signature?: string;
  }[];
  documents?: {
    passport?: string;
    validId?: string;
    signature?: string;
    utilityBill?: string;
    [key: string]: string | undefined;
  };
}

export interface POSAccountState {
  customerPosAccount: [];
  dashboardSummary: DashboardSummary;
  totalRecords: number;
  currentPage: number;
  entriesPerPage: number | "all";
  searchQuery: string;
  nextUrl: string | null;
  prevUrl: string | null;
}


export interface SavingsAccountState {
  customerSavingsAccount: [];
  dashboardSummary: DashboardSummary;
  totalRecords: number;
  currentPage: number;
  entriesPerPage: number | "all";
  searchQuery: string;
  nextUrl: string | null;
  prevUrl: string | null;
}

export interface CardRequestItem {
  accountNumber: string;
  accountType: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  [key: string]: string;
}

export interface CardRequestSummary {
  totalRequests?: number;
  pendingRequests?: number;
  approvedRequests?: number;
  todayRequests?: number;
}

export interface CardRequestResponse {
  data: CardRequestItem[];
  summary: CardRequestSummary;
}

export interface CardRequestState {
  cardRequests: CardRequestResponse;
  totalRecords: number;
  currentPage: number;
  entriesPerPage: number | "all";
  searchQuery: string;
  nextUrl: string | null;
  prevUrl: string | null;
}


export interface CustomerSummary {
  totalCustomers?: number;
  weeklyCustomers?: number;
  monthlyCustomers?: number;
  lastMonth?: number;
}

export interface CustomerAccountState {
  customerList: [];
  summary: CustomerSummary;
  totalRecords: number;
  currentPage: number;
  entriesPerPage: number | "all";
  searchQuery: string;
  nextUrl: string | null;
  prevUrl: string | null;
  customerDetails: CustomerDetails;
  customerDetailModal: boolean;
}

export interface CustomerDetails {
  bvn?: string;
  nin?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  savingsAccountNumber?: string;
  currentAccountNumber?: string;
  corporateAccountNumber?: string;
  [key: string]: string | number | undefined; 
}

export interface AdminData {
  firstname: string;
  lastname?: string;
  email?: string;
}

export interface SideBarProps {
  collapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}