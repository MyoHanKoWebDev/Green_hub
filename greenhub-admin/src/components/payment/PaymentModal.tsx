import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import axios from "../../../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedPayment: any | null; // Replace 'any' with your PaymentData interface
}

export default function PaymentModal({ isOpen, onClose, onSuccess, selectedPayment }: PaymentModalProps) {
  const [methodName, setMethodName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading , setLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{ variant: "error"; title: string; message: string } | null>(null);

  // Sync form when selectedPayment changes (e.g. clicking Edit)
  useEffect(() => {
    if (selectedPayment) {
      setMethodName(selectedPayment.method);
      setImagePreview(`http://localhost:8000/uploads/admin/${selectedPayment.payImg}`);
    } else {
      setMethodName("");
      setImagePreview(null);
    }
    setImageFile(null);
    setAlertConfig(null);
  }, [selectedPayment, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("method", methodName);
    if (imageFile) formData.append("payImg", imageFile);
    if (selectedPayment) formData.append("_method", "PUT");

    try {
      const url = selectedPayment ? `/admin/payments/${selectedPayment.id}` : "/admin/payments";
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(res.data.message);
        onSuccess(); // Refresh the list in the parent
        onClose();   // Close the modal
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
      const validationErrors = axiosError.response?.data?.errors;
      let displayMessage = axiosError.response?.data?.message || "Something went wrong";

      if (validationErrors) {
        displayMessage = Object.values(validationErrors)[0][0];
      }

      setAlertConfig({ variant: "error", title: "Action Failed", message: displayMessage });
    } finally {
      setLoading(false)
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
      <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {selectedPayment ? "Edit" : "Add"} Payment Method
        </h4>
        
        {alertConfig && <Alert {...alertConfig} />}

        <form onSubmit={handleSave} className="flex flex-col gap-5 mt-6">
          <div>
            <Label>Method Name</Label>
            <Input
              type="text"
              value={methodName}
              onChange={(e) => setMethodName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Method Icon (Image)</Label>
            <label className={`mt-2 flex items-center ${imagePreview && "px-20" } justify-center$ w-full h-36 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5`}>
              <div className="text-center w-full">
                <PhotoIcon className={`mx-auto h-6 w-6 text-gray-400 ${imagePreview ? "hidden" : "block"}`}/>
                <span className="text-xs text-gray-500 object-cover">
                  {imagePreview ?  
                    (
                        <div className="w-full">
                <img src={imagePreview} alt="Preview" className="w-full h-36 rounded-lg border " />
              </div>
                    )
                  : "Select image (JPG, PNG)"}
                </span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} required={!selectedPayment} />
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button size="sm" variant="outline" className="flex-1" type="button" onClick={onClose} disabled={loading}>Close</Button>
            <Button size="sm" type="submit" className="flex-1" disabled={loading}>
              {loading ? "Processing..." : selectedPayment ? "Update Method": "Save Method"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}