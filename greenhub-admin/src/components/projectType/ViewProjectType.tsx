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
import ProjectTypeModal from "./ProjectTypeModal.js";
import { ConfirmModal } from "../common/ConfirmModalDelete.js";

interface ProjectTypeData {
  id: number;
  typeName: string;
  shareDate: string | null;
  eco_projects_count?: number; // From your withCount() in Laravel
  created_at: string;
}

export default function ViewProjectTypes() {
  const [types, setTypes] = useState<ProjectTypeData[]>([]);
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedType, setSelectedType] = useState<ProjectTypeData | null>(
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

  const fetchTypes = async () => {
    try {
      const res = await axios.get("/admin/types");
      if (res.data.status) {
        setTypes(res.data.data);
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
    fetchTypes();
  }, []);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    {
      try {
        const res = await axios.delete(`/admin/types/${itemToDelete}`);
        if (res.data.status || res.status == 200) {
          toast.success(res.data.message, {
            duration: 4000,
            style: {
              borderRadius: "10px",
            },
          });
          setTypes((preTypes) => preTypes.filter((p) => p.id !== itemToDelete));
          setIsConfirmOpen(false); // Close modal on success
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
        <PageBreadcrumb pageTitle="Project Type Management" />

        <Button
          onClick={() => {
            setSelectedType(null);
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
                className="px-5 py-3 text-start  dark:text-gray-400"
              >
                Project Type
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
                  {types.length > 0 ? (
                    types.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {type.typeName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDate(type.created_at)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-end">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedType(type);
                                openModal();
                              }}
                              className="p-2 text-gray-500 hover:text-brand-500"
                            >
                              <PencilSquareIcon className="w-4 h-4 " />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(type.id)}
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
                        No types found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              
            )}
          </AnimatePresence>
        </Table>
        </motion.div>
      </div>

      <ProjectTypeModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={fetchTypes}
        selectedType={selectedType}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Project type?"
        message="This will permanently remove the project type and its video from the database."
      />
    </div>
  );
}
