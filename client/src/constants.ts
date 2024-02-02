export const RoutePath = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PROFILE_CREATE: "/profile/create",
  OPPORTUNITIES: "/opportunities",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PROFILE: "/admin/profile",
} as const;

export const ALL_PREFERENCES = [
  "WORKING_WITH_CHILDREN",
  "WORKING_WITH_SENIOR_CITIZENS",
  "WORKING_WITH_SPECIAL_NEEDS",
  "WORKING_WITH_ANIMALS",
  "WORKING_WITH_MIGRANT_WORKERS",
  "WORKING_WITH_HEALTHCARE_WORKERS",
  "WORKING_OUTDOORS",
  "FUNDRAISING",
  "TEACHING STUDENTS",
] as const;
