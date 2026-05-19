import React from "react";
import ProjectCard from "./Projectcard";
import ProjectSkeleton from "../skeleton/ProjectSkeleton";

const ProjectFeed = ({ projects, loading, onDelete, onEdit}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {[1, 2].map((i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} onDelete={onDelete} onEdit={onEdit}/>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500">
          No projects found. Be the first to share!
        </div>
      )}
    </div>
  );
};

export default ProjectFeed;