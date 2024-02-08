export type UserRole = "VOLUNTEER" | "ADMIN";

// Profile
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
export type ResidentialStatus = "SINGAPORE_CITIZEN" | "SINGAPORE_PR" | "EP" | "DP" | "LTVP" | "STUDENT_PASS" | "VISITOR_VISA";
export type UpdateProfileDataRequest = {
  occupation: string;
  school: string;
  educationBackground: string;
  driving: boolean;
  ownsVehicle: boolean;
  commitmentLevel: string;
  phone: string;
  skills: string;
  experience: string;
  address: string;
  postalCode: string;
  preferences: Preference[];
};
export type ProfileDataResponse = {
  clerkUserId: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  volunteer: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    occupation: string;
    school: string;
    educationBackground: string;
    driving: boolean;
    ownsVehicle: boolean;
    commitmentLevel: string;
    phone: string;
    residentialStatus: ResidentialStatus;
    skills: string;
    experience: string;
    address: string;
    postalCode: string;
    VolunteerPreference: { preference: Preference }[];
  };
};
export type CreateProfileDataRequest = UpdateProfileDataRequest & {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  residentialStatus: ResidentialStatus;
};

// Opportunity
export type Opportunity = {
  id: string;
  name: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  durationMinutes: number;
  imageUrl: string;
  archive: boolean;
};
export type CreateOpportunityRequest = Omit<Opportunity, "id">;
export type UpdateOpportunityRequest = Omit<Opportunity, "id" | "imageUrl">;
export type UpdateOpportunityImageRequest = {
  imageUrl: string;
};
export type OpportunityResponse = SwapDatesWithStrings<Opportunity> & {
  /**  only for volunteer user*/
  VolunteerOpportunityEnrollment?: Enrollment[];
  /** only for admin user */
  _count?: { VolunteerOpportunityEnrollment: number };
};

// Enrollment
export type Enrollment = {
  volunteerId: string;
  opportunityId: string;
  adminApproved: boolean;
  didAttend: boolean;
};
export type EnrollmentWithVolunteer = Enrollment & {
  volunteer: {
    firstName: string;
    lastName: string;
    gender: Gender;
    phone: string;
    user: {
      email: string;
    };
  };
};
export type EnrollmentWithOpportunity = Enrollment & {
  opportunity: Opportunity;
};
export type AdminGetVolunteers = ProfileDataResponse;
export type AdminGetVolunteer = AdminGetVolunteers & {
  enrollments: EnrollmentWithOpportunity[];
};

// Utility types
export type SwapDatesWithStrings<T> = {
  [k in keyof T]: T[k] extends Date ? string : T[k];
};
