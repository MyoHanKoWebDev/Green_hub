import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table/index.js";
import {
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import TableSkeleton from "../common/TableSkeleton.js";
import axios from "../../../api/axios.js";
import Alert from "../ui/alert/Alert.js";
import PageBreadcrumb from "../common/PageBreadCrumb.js";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helper.js";
import OrderDetailsModal from "./OrderModal.js";
import { ConfirmOrderModal } from "../common/ConfirmOrderModa.js";

interface OrderData {
  id: number;
  status: "pending" | "confirmed" | "rejected";
  purchaseDate: string;
  shipping_address: string;
  user: {
    name: string;
    proImg: string | null;
    email: string;
  };
  transaction: {
    tran_no: string;
    payment_proof_img: string;
    payment: { method: string };
  };
}

export default function ViewOrder() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals State
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionConfig, setActionConfig] = useState<{
    id: number;
    type: "confirm" | "reject";
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/user/orders", {
        params: { search: searchTerm, status: filterStatus },
      });
      if (res.data.status) {
        setOrders(res.data.data);
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
    const timer = setTimeout(() => fetchOrders(), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus]);

  const openActionConfirm = (id: number, type: "confirm" | "reject") => {
    setActionConfig({ id, type });
    setIsConfirmOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!actionConfig) return;
    setIsProcessing(true);
    try {
      const res = await axios.post(
        `/user/orders/${actionConfig.id}/${actionConfig.type}`,
      );
      if (res.data.status) {
        toast.success(`Order ${actionConfig.type}ed successfully`, {
          duration: 4000,
          style: {
            borderRadius: "10px",
          },
        });
        fetchOrders();
      }
    } catch (err: any) {
      const axiosError = err as AxiosError<{ message: string }>;
      setAlertConfig({
        variant: "error",
        title: "Fetch Error",
        message: axiosError.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
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
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <PageBreadcrumb pageTitle="Order Management" />

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.03] outline-none text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="py-2 px-4 rounded-lg border border-gray-200 dark:border-white/[0.1] dark:bg-white/[0.03] outline-none text-sm"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      {alertConfig && <Alert {...alertConfig} />}

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start">
                  Customer
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">
                  Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-end">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <AnimatePresence mode="wait">
              {loading ? (
                <TableSkeleton key="skeleton" />
              ) : (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id} className="group">
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden">
                              {order.user?.proImg ? (
                                <img
                                  src={`http://localhost:8000/uploads/profiles/${order.user.proImg}`}
                                  alt={order.user.proImg}
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full font-bold text-gray-400">
                                  {order.user.name[0]}
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white/90">
                              {order.user?.name ?? "U"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm">
                          {formatDate(order.purchaseDate)}
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              order.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : order.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-end">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsOpen(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-brand-500"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            {order.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    openActionConfirm(order.id, "confirm")
                                  }
                                  className="p-1.5 text-gray-400 hover:text-emerald-600"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    openActionConfirm(order.id, "reject")
                                  }
                                  className="p-1.5 text-gray-400 hover:text-rose-600"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
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
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </AnimatePresence>
          </Table>
        </motion.div>
      </div>

      {/* Confirmation for Confirm/Reject Action */}
      <ConfirmOrderModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleStatusUpdate}
        loading={isProcessing}
        variant={actionConfig?.type === "confirm" ? "confirm" : "reject"}
        title={
          actionConfig?.type === "confirm" ? "Approve Order?" : "Reject Order?"
        }
        message={
          actionConfig?.type === "confirm"
            ? "This will verify payment and reduce product stock."
            : "Are you sure you want to reject this order? This cannot be undone."
        }
      />

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
