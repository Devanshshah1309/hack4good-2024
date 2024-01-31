import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authenticatedGet, authenticatedPut } from "../axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Profile() {
  let navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  if (!isSignedIn) navigate("/");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authenticatedGet("http://127.0.0.1:3000/me", (await getToken()) ?? "");
      const data = res.data;
      setFirstName(data.firstName);
      setLastName(data.lastName);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      await authenticatedPut("http://127.0.0.1:3000/me", data, (await getToken()) ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      alert("failed to save");
    },
    onSettled: () => {
      setSaving(false);
    },
  });

  if (query.isLoading) return "Loading...";

  return (
    <>
      <Navbar />
      <div>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
        <button
          onClick={() => {
            setSaving(true);
            mutation.mutate({ firstName, lastName });
          }}
        >
          Edit My Name
        </button>
        {saving && "Saving..."}
        <pre>
          Me:
          <br />
          {JSON.stringify(query.data, undefined, 2)}
        </pre>
      </div>
    </>
  );
}

export default Profile;
