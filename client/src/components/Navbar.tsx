import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        <br />
        <Link to={"/dashboard"}>Dashboard</Link>
        <br />
        <Link to={"/me"}>Profile</Link>
      </SignedIn>
    </div>
  );
}

export default Navbar;
