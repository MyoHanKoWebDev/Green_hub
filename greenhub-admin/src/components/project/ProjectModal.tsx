import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Alert from "../ui/alert/Alert";
import { TrashIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface PorjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedProject: any | null;
  projectTypes: any | null; // Replace 'any' with your PaymentData interface
}

export default function ProjectModal({
  isOpen,
  onClose,
  onSuccess,
  selectedProject,
  projectTypes,
}: PorjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    variant: "error";
    title: string;
    message: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [isVideoCleared, setIsVideoCleared] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject.title);
      setDescription(selectedProject.description);
      setProjectTypeId(selectedProject.project_type_id.toString());
    } else {
      setTitle("");
      setDescription("");
      setProjectTypeId("");
    }
    setVideoFile(null);
    setIsVideoCleared(false);
    setUploadProgress(0);
    setUploadStatus("idle");
  }, [selectedProject, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadStatus("uploading");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("project_type_id", projectTypeId);
    if (videoFile) formData.append("video", videoFile);
    if (selectedProject) formData.append("_method", "PUT");

    try {
      const url = selectedProject
        ? `/admin/projects/${selectedProject.id}`
        : "/admin/projects/storeAdmin";
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 600000,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          setUploadProgress(percent);
        },
      });

      if (res.data.status) {
        setUploadStatus("success");
        toast.success(res.data.message);
        onSuccess();
        onClose();
      }
    } catch (err) {
      setUploadStatus("error");
      const axiosError = err as AxiosError<{
        message: string;
        errors?: Record<string, string[]>;
      }>;
      const validationErrors = axiosError.response?.data?.errors;
      let displayMessage =
        axiosError.response?.data?.message || "Something went wrong";

      if (validationErrors) {
        displayMessage = Object.values(validationErrors)[0][0];
      }

      setAlertConfig({
        variant: "error",
        title: "Action Failed",
        message: displayMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alertConfig) {
      const timer = setTimeout(() => {
        setAlertConfig(null);
      }, 4000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [alertConfig]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {selectedProject ? "Edit" : "Add"} Admin Project
        </h4>
        {alertConfig && <Alert {...alertConfig} />}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <div>
            <Label>Project Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Project Type</Label>
            <select
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              value={projectTypeId}
              onChange={(e) => setProjectTypeId(e.target.value)}
              required
            >
              <option value="">Select a type</option>
              {projectTypes.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.typeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* New Dashboard-Style Video Upload Section */}
          <div className="space-y-3">
            <Label>Project Video (Max 50MB)</Label>

            {/* Logic: Show upload input if NO new file AND (No existing video OR existing video was cleared) */}
            {!videoFile && (!selectedProject?.video || isVideoCleared) ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5 transition-all">
                <VideoCameraIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload video
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  required={!selectedProject || isVideoCleared}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fileSizeInMB = file.size / (1024 * 1024);
                      if (fileSizeInMB > 50) {
                        setAlertConfig({
                          variant: "error",
                          title: "Action Failed",
                          message:
                            "This video is " +
                            fileSizeInMB.toFixed(2) +
                            "MB. Max limit is 50MB.",
                        });
                        return;
                      }
                      setVideoFile(file);
                      setIsVideoCleared(false);
                    }
                  }}
                />
              </label>
            ) : (
              <div
                className={`p-4 rounded-2xl border ${uploadStatus === "error" ? "border-red-200 bg-red-50" : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-500/10 rounded-lg">
                      <VideoCameraIcon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-700 dark:text-white truncate max-w-[200px]">
                        {videoFile ? videoFile.name : selectedProject?.video}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {uploadStatus === "uploading"
                          ? `Uploading... ${uploadProgress}%`
                          : uploadStatus === "error"
                            ? "Upload Failed"
                            : videoFile
                              ? "Ready to save"
                              : "Current Project Video"}
                      </p>
                    </div>
                  </div>

                  {/* Updated Trash Button Logic */}
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setIsVideoCleared(true); // This triggers the UI switch
                      setUploadStatus("idle");
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        uploadStatus === "idle" &&
                        !isVideoCleared &&
                        selectedProject?.video
                          ? "100%"
                          : `${uploadProgress}%`,
                    }}
                    className={`h-full ${uploadStatus === "error" ? "bg-red-500" : "bg-brand-500"}`}
                  />
                </div>

                {uploadStatus === "error" && (
                  <button
                    type="button"
                    onClick={handleSubmit} // This now works with your latest handleSubmit
                    className="mt-2 text-xs font-bold text-red-600 hover:underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4 lg:justify-end">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? uploadProgress < 100
                  ? `Uploading ${uploadProgress}%`
                  : "Processing..."
                :selectedProject ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
