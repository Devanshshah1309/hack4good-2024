import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authenticatedPost } from "../axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { CreateProfileDataRequest } from "../../../sharedTypes";
import { RoutePath } from "../main";
import Sidebar from "../components/Sidebar";

function CreateProfile() {
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  if (!isSignedIn) navigate(RoutePath.ROOT);

  const [profileData, setProfileData] = useState<CreateProfileDataRequest>({
    firstName: "David",
    lastName: "Brown",
    dateOfBirth: new Date("11 Apr 2001"),
    gender: "M",
    phone: "12345678",
    residentialStatus: "SINGAPORE_CITIZEN",
    skills: "many skills",
    experience: "",
    address: "",
    postalCode: "",
    preferences: [],
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateProfileDataRequest) => {
      await authenticatedPost(
        "http://127.0.0.1:3000/profile",
        data,
        (await getToken()) ?? ""
      );
    },
    onSuccess: () => {
      navigate(RoutePath.DASHBOARD);
    },
    onError: () => {
      console.error("failed to save");
    },
  });

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <div>
            <pre>
              Me:
              <br />
              {JSON.stringify(profileData, undefined, 2)}
            </pre>
            <br />
            <button
              onClick={() => {
                mutation.mutate(profileData);
              }}
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProfile;
