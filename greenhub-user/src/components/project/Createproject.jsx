import React, { useEffect, useState } from "react";
import { PhotoIcon, TrashIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import axios from "../../../api/axios";
import { getImageUrl } from "../../utils/getImageUrl";
import { useNavigate } from "react-router-dom";

const CreateProjectPost = ({ user, projectTypes, onCancel, onSuccess, projectToEdit=null}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const navigate = useNavigate();

  // --- 1. POPULATE FORM FOR EDITING ---
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || "");
      setDescription(projectToEdit.description || "");
      setProjectTypeId(projectToEdit.project_type_id?.toString() || "");
      // Note: We don't set the videoFile here because it's a File object.
      // The UI will show "Ready to share" or "Keep existing" logic.
      setUploadStatus("idle");
    } else {
      // Clear form if switching back to "Create" mode
      setTitle("");
      setDescription("");
      setProjectTypeId("");
      setVideoFile(null);
    }
  }, [projectToEdit]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 50) {
        toast.error(`Video is ${fileSizeInMB.toFixed(2)}MB. Max limit is 50MB.`);
        return;
      }
      setVideoFile(file);
      setUploadStatus("idle");
      setUploadProgress(0);
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    
    // In Edit mode, video is optional (keep old one if not provided)
    if (!projectToEdit && !videoFile) return toast.error("Please upload a project video");
    if (!projectTypeId) return toast.error("Please select a project type");

    setLoading(true);
    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("project_type_id", projectTypeId);
    formData.append("member_id", user.id);

    if (videoFile) {
      formData.append("video", videoFile);
    }

    // --- 2. DYNAMIC URL AND METHOD ---
    // If editing, Laravel requires _method: PUT inside a POST request for FormData
    const url = projectToEdit 
      ? `/api/admin/projects/${projectToEdit.id}` 
      : "/api/admin/projects/storeMember";

    if (projectToEdit) {
      formData.append("_method", "PUT");
    }

    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
        },
      });

      if (response.data.status) {
        setUploadStatus("success");
        toast.success(projectToEdit ? "Project Updated!" : "Project Shared Successfully!");
        onSuccess();
      }
    } catch (err) {
      setUploadStatus("error");
      const msg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors)[0][0] 
        : "Operation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitPost} className="bg-white p-4 mb-6 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          onClick={()=>navigate(`/user/${user?.id}`)}
          src={getImageUrl(user.proImg,user)}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">EcoMember</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Project Title"
        required
        className="w-full mb-2 p-3 rounded-lg border-none outline-none focus:border-none focus:outline-none text-gray-800"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Project Type Dropdown (Smooth) */}
      <Disclosure as="div" className="border border-gray-100 rounded-xl bg-gray-50/50 mb-3 ">
        {({ open }) => (
          <>
            <DisclosureButton className="flex w-full items-center justify-between p-3 text-gray-400">
              <span className="">
                {projectTypeId 
                  ? projectTypes.find(t => t.id.toString() === projectTypeId)?.typeName 
                  : "Select Project Type"}
              </span>
              {open ? <MinusIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
            </DisclosureButton>
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0 max-h-0"
              enterTo="transform scale-100 opacity-100 max-h-[300px]"
              leave="transition duration-150 ease-out"
              leaveFrom="transform scale-100 opacity-100 max-h-[300px]"
              leaveTo="transform scale-95 opacity-0 max-h-0"
            >
              <DisclosurePanel className="p-2 pt-0 space-y-1">
                {projectTypes?.map((type) => (
                  <div 
                    key={type.id}
                    onClick={() => {
                      setProjectTypeId(type.id.toString());
                    }}
                    className={`p-2 px-3 rounded-lg cursor-pointer text-sm transition ${
                      projectTypeId === type.id.toString() 
                      ? "bg-lime-300 text-gray-500" 
                      : "hover:bg-lime-50 text-gray-600"
                    }`}
                  >
                    {type.typeName}
                  </div>
                ))}
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>

      {/* Description */}
      <textarea
        placeholder="Tell the community about your project..."
        className="w-full mb-3 p-3 rounded-lg border border-slate-300 focus:ring-1 focus:ring-lime-500 focus:outline-none text-gray-800"
        rows="3"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Video Upload Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {projectToEdit ? "Update Project Video (Optional)" : "Project Video"}
        </label>
        
        {!videoFile ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
            <VideoCameraIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center px-4">
              {projectToEdit ? "Click to change video, otherwise old video is kept" : "Click to upload video (Max 50MB)"}
            </span>
            <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
          </label>
        ) : (
          <div className={`p-4 rounded-2xl border ${uploadStatus === "error" ? "border-red-200 bg-red-50" : "border-lime-100 bg-white"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-lime-500/10 rounded-lg">
                  <VideoCameraIcon className="w-5 h-5 text-lime-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{videoFile.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                    {uploadStatus === "uploading" ? `Uploading ${uploadProgress}%` : "New video selected"}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {setVideoFile(null); setUploadStatus("idle");}}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Framer Motion Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className={`h-full ${uploadStatus === "error" ? "bg-red-500" : "bg-lime-500"}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-8 py-2.5 bg-gray-100 text-gray-800 font-bold rounded-2xl hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-lime-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-lime-100 active:scale-95 transition disabled:opacity-50"
        >
          {loading ? (uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Sharing...") : (projectToEdit ? "Update Post" : "Share Project")}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectPost;
