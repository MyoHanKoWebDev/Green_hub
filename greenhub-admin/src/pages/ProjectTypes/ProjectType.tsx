import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import ViewProjectType from '../../components/projectType/ViewProjectType';

const ProjectType = () => {
  return (
    <>
      <PageMeta
        title="Project Type Management | GreenHub Admin"
        description="Manage secure project types for GreenHub"
      />

      <div className="space-y-6">
        <ViewProjectType />
      </div>
    </>
  )
}

export default ProjectType;