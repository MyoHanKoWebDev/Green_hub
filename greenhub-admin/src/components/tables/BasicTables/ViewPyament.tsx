import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import TableSkeleton from "../../common/TableSkeleton.js";
import axios from "../../../../api/axios";
import Alert from "../../ui/alert/Alert.js";
import Button from "../../ui/button/Button.js";
import PageBreadcrumb from "../../common/PageBreadCrumb.js";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Modal } from "../../ui/modal/index.js";
import Label from "../../form/Label.js";
import Input from "../../form/input/InputField.js";
import { useModal } from "../../../hooks/useModal.js";
import { formatDate } from "../../../utils/helper.js";

interface PaymentData {
  id: number;
  method: string;
  payImg: string;
  is_active: boolean;
  created_at: string;
}

export default function ViewPayment() {
  const { isOpen, openModal, closeModal } = useModal();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Form States
  const [methodName, setMethodName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [alertConfig, setAlertConfig] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Fetch Data
  const fetchPayments = async () => {
    try {
      const response = await axios.get("/admin/payments");
      if (response.data.status) {
        setPayments(response.data.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setAlertConfig({
        variant: "error",
        title: "Fetch Error",
        message: axiosError.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
      try {
        const res = await axios.delete(`admin/payments/${id}`);
        if (res.data.status) {
          toast.success(res.data.message, {
            duration: 4000,
            style: {
              borderRadius: "10px",
            },
          });
          fetchPayments(); // Refresh list
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setAlertConfig({
          variant: "error",
          title: "Fetch Error",
          message: axiosError.response?.data?.message || "Error deleting",
        });
      }
    }
  };

  // Open Modal for Create
  const handleAddClick = () => {
    setSelectedPayment(null);
    setMethodName("");
    setImagePreview(null);
    setImageFile(null);
    openModal();
  };

  // Open Modal for Edit
  const handleEditClick = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setMethodName(payment.method);
    setImagePreview(`http://localhost:8000/uploads/admin/${payment.payImg}`);
    setImageFile(null);
    openModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show new preview
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("method", methodName);
    if (imageFile) formData.append("payImg", imageFile);

    // For Laravel PUT requests with files, we often need to spoof the method
    if (selectedPayment) formData.append("_method", "PUT");

    try {
      const url = selectedPayment
        ? `/admin/payments/${selectedPayment.id}`
        : "/admin/payments";
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(res.data.message, {
          duration: 4000,
          style: {
            borderRadius: "10px",
          },
        });
        fetchPayments();
        closeModal();
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
        // Pick the first error from the first failing field
        const firstField = Object.values(validationErrors)[0];
        displayMessage = firstField[0];
      }

      setAlertConfig({
        variant: "error",
        title: "Action Failed",
        message: displayMessage,
      });
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <PageBreadcrumb pageTitle="Payment Management" />

        <Button
          onClick={handleAddClick}
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Add Method
        </Button>
      </div>

      {/* 🔔 Custom Alert Display */}
      {alertConfig && (
        <Alert
          variant={alertConfig.variant}
          title={alertConfig.title}
          message={alertConfig.message}
        />
      )}
      {/* <div className="flex justify-end"></div> */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5">
        <AnimatePresence mode="wait">
          {loading ? (
            <TableSkeleton key="skeleton" />
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Payment Method
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 overflow-hidden rounded-md border border-gray-100 dark:border-gray-500">
                            <img
                              className="w-full h-full object-cover"
                              // Note: Points to your Laravel public folder
                              src={`http://localhost:8000/uploads/admin/${payment.payImg}`}
                              alt={payment.method}
                            />
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {payment.method}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDate(payment.created_at)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(payment)}
                            className="p-2 text-gray-500 hover:text-brand-500"
                          >
                            {/* <PencilIcon className="w-5 h-5" /> */}
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="p-2 text-gray-500 hover:text-red-600"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🏗️ SHARED MODAL FOR ADD/EDIT */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {selectedPayment ? "Edit Payment Method" : "Add New Payment Method"}
          </h4>
          {/* 🔔 Custom Alert Display */}
          {alertConfig && (
            <Alert
              variant={alertConfig.variant}
              title={alertConfig.title}
              message={alertConfig.message}
            />
          )}
          <form onSubmit={handleSave} className="flex flex-col gap-5 mt-6">
            <div>
              <Label>Method Name</Label>
              <Input
                type="text"
                placeholder="e.g. KBZ Pay"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Method Icon (Image)</Label>
              <input
                type="file"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                onChange={handleFileChange}
                required={!selectedPayment}
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Icon Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border p-1"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                {selectedPayment ? "Save Changes" : "Create Method"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
