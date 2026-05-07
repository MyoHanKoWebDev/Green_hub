import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "../../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { AxiosError } from "axios";
import Alert from "../ui/alert/Alert";
import toast from "react-hot-toast";

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditAdminModal({
  isOpen,
  onClose,
}: EditAdminModalProps) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    adName: "",
    adEmail: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alertConfig, setAlertConfig] = useState<{
    variant: "error";
    title: string;
    message: string;
  } | null>(null);

  // Load current user data into form
  useEffect(() => {
    if (user && isOpen) {
      setFormData({ adName: user.adName, adEmail: user.adEmail });
      setPreviewUrl(
        user.adImage
          ? `http://localhost:8000/uploads/admin/${user.adImage}`
          : null,
      );
    }
  }, [user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show new image preview
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const data = new FormData();
    data.append("_method", "PUT"); // Laravel often requires this for PUT requests with files
    data.append("adName", formData.adName);
    data.append("adEmail", formData.adEmail);
    if (selectedFile) {
      data.append("adImage", selectedFile);
    }

    try {
      const response = await axios.post(`/admin/profile/${user.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        toast.success(response.data.message);
        setUser(response.data.data);
        sessionStorage.setItem("user", JSON.stringify(response.data.data));
        onClose();
      }
    } catch (err) {
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h4>
          <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">
            Update your admin account details and profile picture.
          </p>
        </div>

        {alertConfig && <Alert {...alertConfig} />}

        <form onSubmit={handleSave} className="flex flex-col">
          <div className="custom-scrollbar h-[auto] max-h-[450px] overflow-y-auto px-2 pb-3">
            {/* Image Preview Section */}
            <div className="mb-6 flex flex-col items-center gap-4">
              <Label>Profile Image</Label>
              <Label className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 cursor-pointer">
                <img
                  src={previewUrl || "/images/user/owner.jpg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              </Label>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={formData.adName}
                  onChange={(e) =>
                    setFormData({ ...formData, adName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.adEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, adEmail: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
