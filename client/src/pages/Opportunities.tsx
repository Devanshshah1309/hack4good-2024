import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedGet, authenticatedPost } from "../axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { CreateOpportunityRequest } from "../../../sharedTypes";
import axios from "axios";

export default function Opportunities() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const queryKey = "opportunities";

  const { data } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => authenticatedGet<{ opportunities: any[] }>("/opportunities", (await getToken()) || "", navigate),
  });

  const [opp, setOpp] = useState<Omit<CreateOpportunityRequest, "imageUrl">>({
    name: "",
    description: "",
    start: new Date(),
    end: new Date(),
    durationMinutes: 60,
  });
  const [imgFile, setImgFile] = useState<File | null>(null);

  async function uploadImageFileToCloudinary(): Promise<CreateOpportunityRequest> {
    const oppCopy: CreateOpportunityRequest = { ...opp, imageUrl: "" };

    if (!imgFile) {
      console.log("file is", imgFile);
      return oppCopy;
    }

    const uploadUrl = import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_URL;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET;

    console.log("Uploading file...");
    const formData = new FormData();
    formData.append("file", imgFile);
    formData.append("upload_preset", uploadPreset);

    const res = await axios.post<{ secure_url: string; original_filename: string }>(uploadUrl, formData);
    console.log(res.data);

    oppCopy.imageUrl = res.data.secure_url;
    return oppCopy;
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const oppCopy = await uploadImageFileToCloudinary();
      await authenticatedPost("/admin/opportunities", oppCopy, (await getToken()) ?? "");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: () => {
      console.error("failed to create");
    },
    onSettled: () => {},
  });

  let content: any = "loading...";
  if (data) content = data.data.opportunities;

  return (
    <div className="main-container">
      <Sidebar />
      <div className="main">
        <pre>response data: {JSON.stringify(content, undefined, 2)}</pre>
        <pre>useState data: {JSON.stringify(opp, undefined, 2)}</pre>
        <input value={opp.name} placeholder="opportunity name" onChange={(e) => setOpp({ ...opp, name: e.target.value })} />
        <input value={opp.description} placeholder="opportunity description" onChange={(e) => setOpp({ ...opp, description: e.target.value })} />
        Upload image:
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setImgFile(e.target.files!.length === 0 ? null : e.target.files![0]);
          }}
        />
        <pre>file details: {JSON.stringify(imgFile && { name: imgFile.name, type: imgFile.type, size: imgFile.size }, undefined, 2)}</pre>
        <button onClick={() => mutation.mutate()}>Add opportunity</button>
      </div>
    </div>
  );
}
