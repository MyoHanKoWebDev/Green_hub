import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table/index.js";
import { TrashIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import TableSkeleton from "../common/TableSkeleton.js";
import axios from "../../../api/axios.js";
import Alert from "../ui/alert/Alert.js";
import PageBreadcrumb from "../common/PageBreadCrumb.js";
import { AxiosError } from "axios";
import { formatDate } from "../../utils/helper.js";
import { EyeIcon } from "../../icons/index.js";

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

const ViewContact: React.FC = () => {
  // 2. Add types to the state hooks
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertConfig, setAlertConfig] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`/user/contact`);
        if (res.data.status) {
          setContacts(res.data.data);
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
    fetchContacts();
  }, []);

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
        <PageBreadcrumb pageTitle="Contact Messages" />
      </div>

      {alertConfig && <Alert {...alertConfig} />}

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
                  Sender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start dark:text-gray-400"
                >
                  Subject
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start dark:text-gray-400"
                >
                  Message
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start dark:text-gray-400"
                >
                  Date Received
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
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        {/* SENDER INFO */}
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {contact.name}
                              </span>
                              <span className="block text-xs text-gray-500">
                                {contact.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* SUBJECT */}
                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400">
                          {contact.subject || "No Subject"}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-400 max-w-[200px]">
                          <p className="truncate" title={contact.message}>
                            {contact.message}
                          </p>
                        </TableCell>

                        {/* DATE */}
                        <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {formatDate(contact.created_at)}
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="px-5 py-4 text-end">
                          <div className="flex justify-end gap-2">
                            <button
                              title="View Message"
                              onClick={() => {
                                // Logic to open a modal with contact.message
                                console.log(contact.message);
                              }}
                              className="p-2 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => {
                                /* delete logic */
                              }}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-5 h-5" />
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
                        No messages found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </AnimatePresence>
          </Table>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewContact;
