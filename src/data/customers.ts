export type ProfileStatus = "New" | "Active" | "On Hold" | "Closed";
export type Ternary = "Yes" | "No" | "Maybe";

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string; // ISO date string
  country: string;
  city: string;
  heightCm?: number;
  email: string;
  phone: string;
  college?: string;
  degree?: string;
  income?: string;
  company?: string;
  designation?: string;
  maritalStatus: "Single" | "Divorced" | "Widowed" | "Separated" | "Married";
  languages: string[];
  siblings?: string;
  caste?: string;
  religion?: string;
  wantKids: Ternary;
  openToRelocate: Ternary;
  openToPets: Ternary;
  status: ProfileStatus;
}

export const profiles: Profile[] = [
  {
    id: "1",
    firstName: "Aisha",
    lastName: "Khan",
    gender: "Female",
    dateOfBirth: "1993-04-12",
    country: "India",
    city: "Mumbai",
    heightCm: 165,
    email: "aisha.khan@example.com",
    phone: "+91 98765 43210",
    college: "St. Xavier's College",
    degree: "BA Economics",
    income: "₹18 LPA",
    company: "FinEdge",
    designation: "Financial Analyst",
    maritalStatus: "Single",
    languages: ["English", "Hindi", "Marathi"],
    siblings: "1 younger brother",
    caste: "Sunni",
    religion: "Islam",
    wantKids: "Yes",
    openToRelocate: "Maybe",
    openToPets: "Yes",
    status: "Active",
  },
  {
    id: "2",
    firstName: "Rohit",
    lastName: "Mehra",
    gender: "Male",
    dateOfBirth: "1990-09-03",
    country: "India",
    city: "Bengaluru",
    heightCm: 178,
    email: "rohit.mehra@example.com",
    phone: "+91 99887 66554",
    college: "IIT Delhi",
    degree: "B.Tech Computer Science",
    income: "₹40 LPA",
    company: "CloudWorks",
    designation: "Senior Engineer",
    maritalStatus: "Single",
    languages: ["English", "Hindi"],
    siblings: "1 elder sister",
    caste: "Khatri",
    religion: "Hinduism",
    wantKids: "Yes",
    openToRelocate: "Yes",
    openToPets: "No",
    status: "New",
  },
  {
    id: "3",
    firstName: "Neha",
    lastName: "Verma",
    gender: "Female",
    dateOfBirth: "1995-12-21",
    country: "India",
    city: "Delhi",
    heightCm: 160,
    email: "neha.verma@example.com",
    phone: "+91 91234 56780",
    college: "Lady Shri Ram College",
    degree: "MA Psychology",
    income: "₹15 LPA",
    company: "WellMind",
    designation: "Counselor",
    maritalStatus: "Single",
    languages: ["English", "Hindi"],
    siblings: "2 younger sisters",
    caste: "Brahmin",
    religion: "Hinduism",
    wantKids: "Maybe",
    openToRelocate: "No",
    openToPets: "Yes",
    status: "On Hold",
  },
  {
    id: "4",
    firstName: "Arjun",
    lastName: "Singh",
    gender: "Male",
    dateOfBirth: "1988-06-15",
    country: "India",
    city: "Pune",
    heightCm: 182,
    email: "arjun.singh@example.com",
    phone: "+91 90000 11122",
    college: "SP Jain",
    degree: "MBA",
    income: "₹32 LPA",
    company: "SalesHub",
    designation: "Sales Manager",
    maritalStatus: "Divorced",
    languages: ["English", "Hindi", "Punjabi"],
    siblings: "Only child",
    caste: "Rajput",
    religion: "Hinduism",
    wantKids: "No",
    openToRelocate: "Yes",
    openToPets: "Maybe",
    status: "Active",
  },
  {
    id: "5",
    firstName: "Sara",
    lastName: "D'Souza",
    gender: "Female",
    dateOfBirth: "1992-01-28",
    country: "India",
    city: "Goa",
    heightCm: 167,
    email: "sara.dsouza@example.com",
    phone: "+91 95555 22233",
    college: "Goa University",
    degree: "BCom",
    income: "₹10 LPA",
    company: "BeachStay",
    designation: "Operations Lead",
    maritalStatus: "Single",
    languages: ["English", "Konkani", "Hindi"],
    siblings: "1 younger sister",
    caste: "N/A",
    religion: "Christianity",
    wantKids: "Yes",
    openToRelocate: "No",
    openToPets: "Yes",
    status: "Closed",
  },
  {
    id: "6",
    firstName: "Imran",
    lastName: "Sheikh",
    gender: "Male",
    dateOfBirth: "1991-08-09",
    country: "UAE",
    city: "Dubai",
    heightCm: 175,
    email: "imran.sheikh@example.com",
    phone: "+971 50 123 4567",
    college: "BITS Pilani, Dubai",
    degree: "MS Finance",
    income: "AED 240k/year",
    company: "GulfInvest",
    designation: "Portfolio Analyst",
    maritalStatus: "Single",
    languages: ["English", "Urdu", "Arabic"],
    siblings: "1 elder brother, 1 younger sister",
    caste: "N/A",
    religion: "Islam",
    wantKids: "Yes",
    openToRelocate: "Maybe",
    openToPets: "No",
    status: "Active",
  },
];

export const getProfileById = (id: string) => profiles.find(p => p.id === id);
