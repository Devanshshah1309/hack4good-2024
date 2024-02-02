import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authenticatedGet, authenticatedPut } from "../axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ProfileDataResponse, ProfileDataRequest } from "../../../sharedTypes";
import { RoutePath } from "../main";

function Profile() {
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  if (!isSignedIn) navigate(RoutePath.ROOT);

  const [profileData, setProfileData] = useState<ProfileDataRequest>({
    phone: "",
    skills: "",
    experience: "",
    address: "",
    postalCode: "",
    preferences: [],
  });
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authenticatedGet(
        "http://127.0.0.1:3000/profile",
        (await getToken()) ?? ""
      );
      const data = res.data as ProfileDataResponse;
      setProfileData({
        phone: data.volunteer.phone,
        skills: data.volunteer.skills,
        experience: data.volunteer.experience,
        address: data.volunteer.address,
        postalCode: data.volunteer.postalCode,
        preferences: data.volunteer.VolunteerPreference.map(
          (pref) => pref.preference
        ),
      });
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileDataRequest) => {
      await authenticatedPut(
        "http://127.0.0.1:3000/profile",
        data,
        (await getToken()) ?? ""
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      console.error("failed to save");
    },
    onSettled: () => {
      setSaving(false);
    },
  });

  if (query.isLoading) return "Loading...";

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className="main">
          <h1>My Account</h1>
          {/* <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        /> */}

          <div>
            <input
              value={profileData.experience}
              onChange={(e) =>
                setProfileData({ ...profileData, experience: e.target.value })
              }
              placeholder="Experience"
            />
            <button
              onClick={() => {
                setSaving(true);
                mutation.mutate(profileData);
              }}
            >
              Save Profile
            </button>
            {saving && "Saving..."}

            <br />

            <div>
              <pre>
                profileData: <br />
                {JSON.stringify(profileData, undefined, 2)}
              </pre>
              <button
                onClick={() => {
                  if (profileData.preferences.includes("WORKING_WITH_CHILDREN"))
                    return;
                  setProfileData({
                    ...profileData,
                    preferences: [
                      ...profileData.preferences,
                      "WORKING_WITH_CHILDREN",
                    ],
                  });
                }}
              >
                Add WORKING_WITH_CHILDREN
              </button>
              <button
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    preferences: profileData.preferences.filter(
                      (item) => item != "WORKING_WITH_CHILDREN"
                    ),
                  })
                }
              >
                Remove WORKING_WITH_CHILDREN
              </button>
            </div>
            <br />

            <pre>
              Response data:
              <br />
              {JSON.stringify(query.data, undefined, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
