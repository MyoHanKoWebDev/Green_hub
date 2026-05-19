import React, { Fragment, useEffect, useRef, useState } from "react";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, EllipsisVerticalIcon, InformationCircleIcon, PencilSquareIcon, TrashIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatDate";
import { useAuth } from "../../context/AuthContext";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);

  // Helper to show only the first 2 sentences on the card
  const getShortDesc = (text) => {
    if (!text) return "";
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.slice(0, 1).join(" ");
  };

  const hasMore = project.description && project.description.split(/(?<=[.!?])\s+/).length >= 2;

  // Check if current user is the owner
  // Based on your model: EcoProject -> memberProjects -> user
  const isOwner = user && project.member_projects?.some(mp => mp.member_id === user.id);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Helper for URLs
  const VIDEO_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/uploads/videos/`;
  const STORAGE_URL = `${import.meta.env.VITE_BACKEND_URL}/uploads/profiles/`;

  return (
    <>
    <article className="relative flex max-w-xl flex-col items-start justify-between bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      
      {/* Three Dot Menu - Only visible to Owner */}
      {isOwner && (
        <div className="absolute top-4 right-6 z-20" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <EllipsisVerticalIcon className="size-6" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => { onEdit(project); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-600"
              >
                <PencilSquareIcon className="size-4" /> Edit
              </button>
              <button
                onClick={() => { onDelete(project.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="size-4" /> Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* Date + Category */}
      <div className="flex items-center gap-x-4 text-xs w-full">
        <time className="text-gray-500 flex items-center gap-1">
          {formatDate(project.created_at)}
        </time>

        <span className="relative z-10 rounded-full bg-lime-50 px-3 py-1.5 font-semibold text-lime-700">
          {project.project_type?.typeName || "Sustainability"}
        </span>
      </div>

      {/* Media: Handling the video string from your DB */}
      {project.video && (
        <div className="mt-4 w-full rounded-2xl overflow-hidden bg-black aspect-video">
          <video
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          >
            <source
              src={`${VIDEO_BASE_URL}${project.video}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Title + Description */}

      <div className="group relative grow w-full">
        <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-gray-600">
          {project.title}
        </h3>

        <div className="mt-3 text-sm text-gray-600">
            <p className="line-clamp-3">
              {getShortDesc(project.description)}
              {hasMore && (
                <button
                  onClick={() => setIsDescModalOpen(true)}
                  className="ml-1 text-lime-600 hover:underline"
                >
                  ... Read More
                </button>
              )}
            </p>
          </div>
      </div>

      {/* Author: Updated to match your User object structure */}
      <div className="relative mt-6 flex items-center gap-x-4">
        {project.member_projects?.[0]?.user?.proImg ? (
          <img
            onClick={()=>navigate(`/user/${project.member_projects?.[0]?.user?.id}`)}
            src={
              project.member_projects?.[0]?.user?.proImg.startsWith("http")
                ? project.member_projects?.[0]?.user?.proImg
                : `${STORAGE_URL}${project.member_projects?.[0]?.user?.proImg}`
            }
            alt={project.member_projects?.[0]?.user?.name}
            className="size-10 rounded-full bg-gray-50 object-cover ring-2 ring-lime-50 cursor-pointer"
          />
        ) : (
          <UserCircleIcon className="size-10 text-gray-300" />
        )}

        <div className="text-sm">
          <p className="font-bold text-gray-900">
            {/* Access the user through the first memberProject record */}
            {project.member_projects?.[0]?.user?.name || "Eco Member"}
          </p>
          <p className="text-xs text-lime-600 font-medium tracking-tight">
            EcoMember
          </p>
        </div>
      </div>
    </article>

    {/* --- DESCRIPTION MODAL --- */}
      <Transition show={isDescModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={() => setIsDescModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-md" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-lime-100 rounded-xl">
                        <InformationCircleIcon className="w-6 h-6 text-lime-600" />
                      </div>
                      <DialogTitle className="text-2xl font-bold text-gray-900">
                        Project Details
                      </DialogTitle>
                    </div>
                    <button onClick={() => setIsDescModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-lime-600">{project.title}</h4>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setIsDescModalOpen(false)}
                      className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
      </>
  );
};

export default ProjectCard;
