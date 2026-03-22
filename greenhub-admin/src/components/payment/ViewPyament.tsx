import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table/index.js";
import {
  TrashIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import TableSkeleton from "../common/TableSkeleton.js";
import axios from "../../../api/axios.js";
import Alert from "../ui/alert/Alert.js";
import Button from "../ui/button/Button.js";
import PageBreadcrumb from "../common/PageBreadCrumb.js";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useModal } from "../../hooks/useModal.js";
import { formatDate } from "../../utils/helper.js";
import PaymentModal from "./PaymentModal.js";
import { ConfirmModal } from "../common/ConfirmModalDelete.js";

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

  const [alertConfig, setAlertConfig] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };
  // Fetch Data
  const fetchPayments = async () => {
    try {
      setLoading(true);

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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    {
      try {
        const res = await axios.delete(`admin/payments/${itemToDelete}`);
        if (res.data.status) {
          toast.success(res.data.message, {
            duration: 4000,
            style: {
              borderRadius: "10px",
            },
          });
          setPayments((prePyaments) =>
            prePyaments.filter((p) => p.id !== itemToDelete),
          ); // Refresh list
          setIsConfirmOpen(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setAlertConfig({
          variant: "error",
          title: "Fetch Error",
          message: axiosError.response?.data?.message || "Something went wrong",
        });
      } finally {
        setIsDeleting(false);
        setItemToDelete(null);
        setIsConfirmOpen(false);
      }
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
          onClick={() => {
            setSelectedPayment(null);
            openModal();
          }}
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Add Method
        </Button>
      </div>

      {alertConfig && <Alert {...alertConfig} />}

      {/* <div className="flex justify-end"></div> */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5">
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
                  className="px-5 py-3 text-start dark:text-gray-400"
                >
                  Payment Method
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start dark:text-gray-400"
                >
                  Created Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-end dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <AnimatePresence mode="wait">
              {loading ? (
                <TableSkeleton key="skeleton" />
              ) : (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
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
                              onClick={() => {
                                setSelectedPayment(payment);
                                openModal();
                              }}
                              className="p-2 text-gray-500 hover:text-brand-500"
                            >
                              <PencilSquareIcon className="w-4 h-4 " />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(payment.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-10 text-gray-400"
                      >
                        No payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </AnimatePresence>
          </Table>
        </motion.div>
      </div>

      {/* 🏗️ NEW CLEAN COMPONENT */}
      <PaymentModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={fetchPayments}
        selectedPayment={selectedPayment}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Payment?"
        message="This will permanently remove the payment and its video from the database."
      />
    </div>
  );
}
