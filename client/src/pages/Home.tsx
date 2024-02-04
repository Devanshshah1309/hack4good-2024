import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';
import theme from '../Theme';
import { ThemeProvider } from '@emotion/react';
import { Button } from '@mui/material';
import { RoutePath } from '../constants';
import { Typography } from '@material-ui/core';

function Home() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SignedOut>
          <SignInButton
            afterSignUpUrl={RoutePath.PROFILE_CREATE}
            afterSignInUrl="/opportunities"
          >
            <Button variant="contained" color="success">
              Sign In
            </Button>
          </SignInButton>
          <div>
            <Typography variant="h1" style={{ fontWeight: 500 }}>
              Start Volunteering Today!
            </Typography>
            <Typography
              variant="h5"
              align="center"
              style={{ paddingTop: '2rem' }}
            >
              VOLUNASIA is that moment when you forget you're volunteering to
              help change lives, because it's changing yours.
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              style={{ paddingTop: '2rem' }}
            >
              Big At Heart is a Non-Profit Social Service Organization inspiring
              GIVING through Volunteering, Donations-in-kind, and Fundraising.
              We help match volunteers and donors to curated causes,
              specifically those working for Children, Women, and Low Income
              communities. We create custom giving projects or connect you to
              existing causes that you can get involved in.
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              style={{ paddingTop: '2rem' }}
            >
              Join us and start your giving journey in a fun, easy and
              fulfilling way. Come find your volunasia with us !
            </Typography>
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
