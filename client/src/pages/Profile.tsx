import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authenticatedGet, authenticatedPut } from "../axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ProfileDataResponse, ProfileDataRequest } from "../../../sharedTypes";
import { RoutePath } from "../constants";
import useUserRole from "../hooks/useUserRole";

function Profile() {
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { role } = useUserRole();

  if (!isSignedIn) navigate(RoutePath.ROOT);
  if (role === "ADMIN") navigate(RoutePath.ADMIN_PROFILE);

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
  const queryKey = "profile";

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await authenticatedGet("/profile", (await getToken()) ?? "", navigate);
      const data = res.data as ProfileDataResponse;
      setProfileData({
        phone: data.volunteer.phone,
        skills: data.volunteer.skills,
        experience: data.volunteer.experience,
        address: data.volunteer.address,
        postalCode: data.volunteer.postalCode,
        preferences: data.volunteer.VolunteerPreference.map((pref) => pref.preference),
      });
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileDataRequest) => {
      await authenticatedPut("/profile", data, (await getToken()) ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
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

          <div>
            <input value={profileData.experience} onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })} placeholder="Experience" />
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
                  if (profileData.preferences.includes("WORKING_WITH_CHILDREN")) return;
                  setProfileData({
                    ...profileData,
                    preferences: [...profileData.preferences, "WORKING_WITH_CHILDREN"],
                  });
                }}
              >
                Add WORKING_WITH_CHILDREN
              </button>
              <button
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    preferences: profileData.preferences.filter((item) => item != "WORKING_WITH_CHILDREN"),
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
