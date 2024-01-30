import { SignOutButton, SignInButton, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import useClerkQuery from "./hooks/useClerkQuery";

function App() {
  const { data } = useClerkQuery("http://127.0.0.1:3000");

  return (
    <div>
      <SignedOut>
        <SignInButton />
        <p>This content is public. Only signed out users can see the SignInButton above this text.</p>
      </SignedOut>
      <SignedIn>
        <SignOutButton afterSignOutUrl="/" />
        <p>This content is private. Only signed in users can see the SignOutButton above this text.</p>
      </SignedIn>
      <pre>{data}</pre>
    </div>
  );
}

export default App;
