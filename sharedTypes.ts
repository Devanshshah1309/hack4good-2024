export type UserRole = "VOLUNTEER" | "ADMIN";
export type Gender = "M" | "F";
export type Preference =
  | "WORKING_WITH_CHILDREN"
  | "WORKING_WITH_SENIOR_CITIZENS"
  | "WORKING_WITH_SPECIAL_NEEDS"
  | "WORKING_WITH_ANIMALS"
  | "FUNDRAISING"
  | "WORKING_OUTDOORS"
  | "WORKING_WITH_MIGRANT_WORKERS"
  | "WORKING_WITH_HEALTHCARE_WORKERS"
  | "TEACHING STUDENTS";
export type ResidentialStatus =
  | "SINGAPORE_CITIZEN"
  | "SINGAPORE_PR"
  | "EP_PEP_DP"
  | "DP"
  | "LTVP"
  | "STUDENT_PASS"
  | "VISITOR_VISA";
export type ProfileDataRequest = {
  phone: string;
  skills: string;
  experience: string;
  address: string;
  postalCode: string;
  preferences: Preference[];
};
export type ProfileDataResponse = {
  volunteer: {
    VolunteerPreference: { volunteerId: string; preference: Preference }[];
    phone: string;
    skills: string;
    experience: string;
    address: string;
    postalCode: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    residentialStatus: ResidentialStatus;
  };
};
export type CreateProfileDataRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  residentialStatus: ResidentialStatus;
  skills: string;
  experience: string;
  address: string;
  postalCode: string;
  preferences: Preference[];
};
