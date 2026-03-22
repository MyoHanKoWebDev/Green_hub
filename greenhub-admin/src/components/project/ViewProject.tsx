import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../../../api/axios";
import Button from "../ui/button/Button";
import PageBreadcrumb from "../common/PageBreadCrumb";
import toast from "react-hot-toast";
import { useModal } from "../../hooks/useModal";
import ProjectModal from "./ProjectModal";
import { AxiosError } from "axios";
import Alert from "../ui/alert/Alert";
import ProjectCard from "./ProjectCard";
import { PlusIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import ProjectCardSkeleton from "../common/ProjectCardSkeleton";
import { ConfirmModal } from "../common/ConfirmModalDelete";

interface ProjectData {
  id: number;
  title: string;
  description: string;
  video: string | null;
  project_type_id: number;
  role: string;
  created_at: string;
}

interface ProjectTypeData {
  id: number;
  typeName: string;
  find: any;
}

export default function ViewProjects() {
  const { isOpen, openModal, closeModal } = useModal();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, typeRes] = await Promise.all([
        axios.get("/admin/projects"),
        axios.get("/admin/types"),
      ]);
      setProjects(projRes.data.data);
      setProjectTypes(typeRes.data.data);
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
    fetchData();
  }, []);

  const handleEdit = (project: ProjectData) => {
    setSelectedProject(project);
    openModal();
  };

  const handleConfirmDelete = async () => {
    // 1. Ask for confirmation (Optional, but recommended)
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      // 2. Make the API call
      const res = await axios.delete(`/admin/projects/${itemToDelete}`);

      // 3. Check for 200 (Success)
      if (res.status === 200 || res.data.status) {
        // 4. Update the local state immediately so the card disappears
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== itemToDelete),
        );

        toast.success(res.data.message, {
          duration: 4000,
          style: {
            borderRadius: "10px",
          },
        });
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
        <PageBreadcrumb pageTitle="Eco Projects" />
        <Button
          onClick={() => {
            setSelectedProject(null);
            openModal();
          }}
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" /> Add Project
        </Button>
      </div>

      {alertConfig && <Alert {...alertConfig} />}

      <AnimatePresence mode="wait">
        {loading ? (
          <div key="loading">
            <ProjectCardSkeleton />
          </div>
        ) : projects.length > 0 ? (
          <motion.div
            key="content"
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectTypes={projectTypes}
                onEdit={handleEdit}
                onDelete={() => openDeleteConfirm(project.id)}
              />
            ))}
          </motion.div>
        ) : (
          /* --- Modern Empty State --- */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-white dark:bg-white/[0.03] border border-dashed border-gray-200 dark:border-white/[0.1] rounded-2xl"
          >
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-50 dark:bg-white/[0.05]">
              <VideoCameraIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              No projects found
            </h3>
            <p className="max-w-xs mt-1 text-sm text-center text-gray-500">
              It looks like your project gallery is empty. Start by adding your
              first ecological project.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={fetchData}
        selectedProject={selectedProject}
        projectTypes={projectTypes}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Project?"
        message="This will permanently remove the project and its video from the database."
      />
    </div>
  );
}
