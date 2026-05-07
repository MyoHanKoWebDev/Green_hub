import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Alert from "../ui/alert/Alert";
import { useAuth } from "../../context/AuthContext";

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPasswordModal({ isOpen, onClose }: EditPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [alertConfig, setAlertConfig] = useState<{
      variant: "error";
      title: string;
      message: string;
    } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!user) return;

    try {
      // Assuming your backend route is /admin/change-password
      const res = await axios.put(`admin/profile/change-password/${user.id}`, passwords);
      if(res.data.status){
        toast.success(res.data.message);
      setPasswords({ current_password: "", new_password: "", new_password_confirmation: "" });
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Change Password
        </h4>
        <p className="mb-7 text-sm text-gray-500">
          For your security, do not share your password with others.
        </p>

        {alertConfig && <Alert {...alertConfig} />}

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <Label>Current Password</Label>
            <Input 
              type="password" 
              placeholder="Enter current password"
              value={passwords.current_password}
              onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
              required
            />
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          <div>
            <Label>New Password</Label>
            <Input 
              type="password" 
              placeholder="Min. 8 characters"
              value={passwords.new_password}
              onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input 
              type="password" 
              placeholder="Repeat new password"
              value={passwords.new_password_confirmation}
              onChange={(e) => setPasswords({...passwords, new_password_confirmation: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center gap-3 mt-4 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}