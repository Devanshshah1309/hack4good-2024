import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function useClerkQuery(url: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      return res.data;
    },
  });
}
