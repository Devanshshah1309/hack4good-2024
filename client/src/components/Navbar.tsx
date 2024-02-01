import { SignOutButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { RoutePath } from "../main";

function Navbar() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        <br />
        <Link to={RoutePath.DASHBOARD}>Dashboard</Link>
        <br />
        <Link to={RoutePath.PROFILE}>Profile</Link>
      </SignedIn>
    </div>
  );
}

export default Navbar;
