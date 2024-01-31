import { SignOutButton, SignInButton, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authenticatedGet, authenticatedPut } from "./axios";

function App() {
  const { getToken } = useAuth();
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
    <div>
      <SignedOut>
        <SignInButton />
        <p>This content is public. Only signed out users can see the SignInButton above this text.</p>
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        <p>This content is private. Only signed in users can see the SignOutButton above this text.</p>

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
      </SignedIn>
    </div>
  );
}

export default App;
