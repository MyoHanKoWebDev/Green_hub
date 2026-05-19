import { useEffect, useState } from "react";
import ProjectFeed from "../components/project/Projectfeed";
import CreateProjectPost from "../components/project/Createproject"; // Renamed to match your second snippet
import Heroimg from "../components/common/Heroimg";
import Footer from "../components/common/Footer";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ConfirmModal from "../components/common/ConfirmationDelete";

const Projects = ({memberId = null, onProjectCreated , onProjectDeleted}) => {
  // const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Get auth state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inside your ProjectFeed or Member Dashboard component
  const [projects, setProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const handleOpenCreate = () => {
    if (!user) {
          // 1. Show Alert (Using toast for a better Nganter UI experience)
          toast.error("Please sign in to share to projects");
          return;
      }
    setEditingProject(null); // Clear previous edit data
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project); // Set the project to fill the form
    setIsModalOpen(true);
  };

  // Called when user clicks "Delete" in the three-dot menu
  const handleDeleteTrigger = (id) => {
    setTargetId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/admin/projects/${targetId}`);
      if (res.data.status) {
        toast.success(res.data.message);
        // Remove from UI list
        setProjects((prev) => prev.filter((p) => p.id !== targetId));
        if(onProjectDeleted) onProjectDeleted();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      // Construct the URL with the profile_id filter
    let url = "/api/user/projects";
    if (memberId) {
      url += `?profile_id=${memberId}`;
    }

    const [projRes, typeRes] = await Promise.all([
      axios.get(url),
      axios.get("/api/admin/types"),
    ]);
      // 2. Map the data based on your Laravel response structure
      setProjects(projRes.data.data);
      setProjectTypes(typeRes.data.data);
      console.log(typeRes.data.data);
    } catch (err) {
      console.log(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  return (
    <>
    {!memberId &&
    <Heroimg
        title="Community Green Projects"
        desc="Explore inspiring eco-projects created by members of our GreenHub community."
      />
    }

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:col-span-3 space-y-6 pt-6">
          {(!memberId || Number(memberId) === user?.id) && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="hidden sm:block">
            <h4 className="font-bold text-gray-800 text-start text-xl mb-2">Showcase your eco-impact</h4>
            <p className="text-xs text-gray-400 text-start">Share your latest green project with the world.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-lime-500 text-white px-6 py-2.5 rounded-xl hover:bg-lime-600 shadow-md transition-all active:scale-95 text-md font-bold"
          >
            + Share Project
          </button>
        </div>
      )}

          <ProjectFeed
            projects={projects}
            loading={loading}
            onDelete={handleDeleteTrigger}
            onEdit={handleOpenEdit}
          />
        </div>
      </div>

      {/* --- MODAL COMPONENT --- */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto mt-15">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      Create Green Project
                    </DialogTitle>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Your Form Component */}
                  <CreateProjectPost
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    projectTypes={projectTypes}
                    projectToEdit={editingProject}
                    onSuccess={() => {
                      onProjectCreated();
                      fetchMemberData(); // Refresh the feed after a new post
                      setIsModalOpen(false);
                    }}
                    user={user}
                  />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* The Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        projectToEdit={editingProject}
        loading={isDeleting}
        title="Delete this Project?"
        message="This action will move your project to trash and permanently delete the uploaded video. This cannot be undone."
      />
      
      {!memberId &&
        <Footer />
      }
    </>
  );
};

export default Projects;
