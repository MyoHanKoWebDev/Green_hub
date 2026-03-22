import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import ViewProjects from '../../components/project/ViewProject';

const Project = () => {
  return (
    <>
      <PageMeta
        title="Project Management | GreenHub Admin"
        description="Manage secure projects for GreenHub"
      />

      <div className="space-y-6">
        <ViewProjects />
      </div>
    </>
  )
}

export default Project;