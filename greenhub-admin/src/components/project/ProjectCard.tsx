import { useRef, useState } from "react";
import {
  PencilSquareIcon,
  PlayIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/helper.js";
import { TrashBinIcon } from "../../icons";

interface ProjectTypeData {
  id: number;
  typeName: string;
  shareDate: string | null;
}

interface ProjectCardProps {
  project: any; // Using any or your ProjectData interface
  projectTypes: ProjectTypeData[];
  onEdit: (project: any) => void;
  onDelete: (id: number) => void;
}

export default function ProjectCard({
  project,
  projectTypes,
  onEdit,
  onDelete,
}: ProjectCardProps){
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current; 
   if (video) {
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    }
    setIsPlaying(!isPlaying);
  }
  };

 const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl overflow-hidden shadow-sm">
      {/* 1. Header: Avatar & Title */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
            {project.role[0].toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white/90 text-sm">
              GreenHub Admin
            </h4>
            <p className="text-xs text-gray-500">
              {formatDate(project.created_at)}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md"
          >
            <PencilSquareIcon className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 hover:bg-red-50 rounded-md"
          >
            <TrashBinIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* 2. Content: Title & Description */}
      <div className="px-4 pb-3">
        <div className="flex items-center flex-wrap gap-2 mb-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {project.title}
          </h3>

          {/* Project Type Badge */}
          {projectTypes.find((t: any) => t.id === project.project_type_id) && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-success-100 text-success-800 border border-success-100 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20">
              {
                projectTypes.find((t: any) => t.id === project.project_type_id)
                  ?.typeName
              }
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Video Section - Height Reduced using aspect-21/9 */}
      <div
        className="relative group bg-black w-full aspect-[3.5/1] overflow-hidden cursor-pointer border-y border-gray-100 dark:border-white/[0.05]"
        onClick={togglePlay}
      >
        {project.video ? (
          <>
            <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      controls={isPlaying} // Only show browser controls AFTER it starts playing
                    >
                      <source
                        src={`http://localhost:8000/uploads/videos/${project.video}`}
                        type="video/mp4"
                      />
                    </video>

            {!isPlaying && (
                      <div
                        onClick={handlePlay}
                        className="absolute inset-0 bg-gray-950/40 flex items-center justify-center cursor-pointer transition-opacity hover:bg-gray-950/20"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <PlayIcon className="h-16 w-16 text-white bg-white/20 p-4 rounded-full border border-white/50 backdrop-blur-sm" />
                          <span className="text-white text-xs font-bold uppercase tracking-widest">
                            Play Project Video
                          </span>
                        </div>
                      </div>
                    )}


            {/* Playing Status Indicator (Top Right) */}
            {isPlaying && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-white font-medium tracking-widest uppercase">
                  Playing
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-800">
            <VideoCameraIcon className="w-8 h-8 opacity-20 mb-2" />
            <span className="text-xs italic">No video content</span>
          </div>
        )}
      </div>
    </div>
  );
}
