import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import Alert from "../ui/alert/Alert";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedType: any | null; // Replace 'any' with your PaymentData interface
}

export default function ProjectTypeModal({
  isOpen,
  onClose,
  onSuccess,
  selectedType,
}: ProjectModalProps) {
  const [typeName, setTypeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    variant: "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (selectedType) {
      setTypeName(selectedType.typeName);
    } else {
      setTypeName("");
    }
  }, [selectedType, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { typeName };
      const res = selectedType
        ? await axios.put(`/admin/types/${selectedType.id}`, payload)
        : await axios.post("/admin/types", payload);

      if (res.data.status) {
        toast.success(res.data.message);
        onSuccess();
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] m-4">
      <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {selectedType ? "Edit" : "Add"} Project Type
        </h4>
        {alertConfig && <Alert {...alertConfig} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <div>
            <Label>Type Name</Label>
            <Input
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="e.g. Solar Energy"
              required
            />
          </div>
          <div className="flex items-center gap-3 mt-4 lg:justify-end">
            <Button size="sm" variant="outline" type="button" onClick={onClose} disabled={loading}>
              Close
            </Button>
            <Button size="sm" type="submit" disabled={loading}>
              {loading ? "Processing..." : selectedType ? "Update ProjectType" : "Save ProjectType"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
