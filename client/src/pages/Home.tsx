import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import theme from "../Theme";
import { ThemeProvider } from "@emotion/react";
import { Button } from "@mui/material";
import { RoutePath } from "../constants";

function Home() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SignedOut>
          <SignInButton afterSignUpUrl={RoutePath.PROFILE_CREATE}>
            <Button variant="contained" color="success">
              Sign In
            </Button>
          </SignInButton>
          <div>
            <h1 className="heading">Start Volunteering Today!</h1>
            <h3 className="subheading">
              VOLUNASIA is that moment when you forget you're volunteering to
              help change lives, because it's changing yours.
            </h3>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="main-container">
            <Sidebar />
            <div className="main">
              <h1 className="center">Welcome!</h1>
            </div>
          </div>
        </SignedIn>
      </ThemeProvider>
    </>
  );
}

export default Home;
