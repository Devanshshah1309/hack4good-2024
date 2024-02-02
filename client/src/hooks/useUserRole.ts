import { useAuth } from "@clerk/clerk-react";
import { UserRole } from "../../../sharedTypes";
import { useQuery } from "@tanstack/react-query";
import { authenticatedGet } from "../axios";

export default function useUserRole() {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => authenticatedGet<{ role: UserRole | null }>("/role", (await getToken()) ?? ""),
  });

  const returnObj: { loading: boolean; role: UserRole | null; error: Error | null } = {
    loading: true,
    role: null,
    error: null,
  };

  if (isPending || !data) return returnObj; // still loading

  returnObj.loading = false;
  returnObj.role = data.data.role;
  returnObj.error = error;
  return returnObj;
}
