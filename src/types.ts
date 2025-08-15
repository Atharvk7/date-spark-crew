export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  maritalStatus: string;
  matchmakerId: string;
  email: string;
  phoneNumber: string;
  height: number;
  income: number;
  religion: string;
  caste: string;
  degree: string;
  currentCompany: string;
  designation: string;
  languagesKnown: string[];
  hobbies: string[];
  wantKids: string;
  openToRelocate: string;
  openToPets: string;
  undergraduateCollege?: string;
}
