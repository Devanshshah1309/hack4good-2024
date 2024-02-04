import { ResidentialStatus } from '../../sharedTypes';

export const RoutePath = {
  ROOT: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_CREATE: '/profile/create',
  OPPORTUNITIES: '/opportunities',
  OPPORTUNITY: '/opportunities/:opportunityId',
  OPPORTUNITY_CREATE: '/opportunity/create',
} as const;

export const ALL_PREFERENCES = [
  'WORKING_WITH_CHILDREN',
  'WORKING_WITH_SENIOR_CITIZENS',
  'WORKING_WITH_SPECIAL_NEEDS',
  'WORKING_WITH_ANIMALS',
  'WORKING_WITH_MIGRANT_WORKERS',
  'WORKING_WITH_HEALTHCARE_WORKERS',
  'WORKING_OUTDOORS',
  'FUNDRAISING',
  'TEACHING STUDENTS',
] as const;

export const RESIDENTIAL_STATUS_MAP: Record<ResidentialStatus, string> = {
  SINGAPORE_CITIZEN: 'Singapore Citizen',
  SINGAPORE_PR: 'Permanent Resident',
  EP: 'Employment Pass',
  DP: 'Dependent Pass',
  LTVP: 'Long Term Visit Pass',
  STUDENT_PASS: 'Student Pass',
  VISITOR_VISA: 'Visitor Visa',
} as const;

export const QueryKey = {
  USER_ROLE: 'userRole',
  OPPORTUNITIES: 'opportunities',
  PROFILE: 'profile',
} as const;

export const PLACEHOLDER_IMAGE_URL =
  'https://static.wixstatic.com/media/f6709c_04d86e504f4d428da3e5c3398a7db723~mv2.jpg/v1/fit/w_2500,h_1330,al_c/f6709c_04d86e504f4d428da3e5c3398a7db723~mv2.jpg';
