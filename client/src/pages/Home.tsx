import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Sidebar from "../components/Sidebar";
import theme from "../Theme";
import { ThemeProvider } from "@emotion/react";

function Home() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SignedOut>
          <SignInButton />
          <div>
            <h1>Start Volunteering Today!</h1>
            <h3>
              VOLUNASIA is that moment when you forget you're volunteering to
              help change lives, because it's changing yours.
            </h3>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="main-container">
            <Sidebar />
            <div className="main">
              <h1>Welcome!</h1>
            </div>
          </div>
        </SignedIn>
      </ThemeProvider>
    </>
  );
}

export default Home;
