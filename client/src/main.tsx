import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home.tsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './pages/Profile.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CreateProfile from './pages/CreateProfile.tsx';
import { RoutePath } from './constants.ts';
import CreateOpportunity from './pages/CreateOpportunity.tsx';
import Opportunities from './pages/Opportunities.tsx';
import Volunteers from './pages/Volunteers.tsx';

// Import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing env var VITE_CLERK_PUBLISHABLE_KEY');
}

// check that cloudinary env vars are present
if (!import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL) {
  throw new Error('Missing env var VITE_CLOUDINARY_IMAGE_UPLOAD_URL');
}
if (!import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET) {
  throw new Error('Missing env var VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET');
}

// react query
const queryClient = new QueryClient();

// react router
const router = createBrowserRouter([
  {
    path: RoutePath.ROOT,
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: RoutePath.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: RoutePath.PROFILE,
    element: <Profile />,
  },
  {
    path: RoutePath.PROFILE_CREATE,
    element: <CreateProfile />,
  },
  {
    path: RoutePath.OPPORTUNITIES,
    element: <Opportunities />,
  },

  // ----- admin routes -----
  {
    path: RoutePath.OPPORTUNITY_CREATE,
    element: <CreateOpportunity />,
  },
  {
    path: RoutePath.VOLUNTEERS,
    element: <Volunteers />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
