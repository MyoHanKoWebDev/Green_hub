import React from 'react'
import PageMeta from '../../components/common/PageMeta'
import ViewContact from '../../components/Contact/ViewContact'

const Contact = () => {
  return (
     <>
      <PageMeta
        title="Contact Management | GreenHub Admin"
        description="View secure contacts for GreenHub"
      />

      <div className="space-y-6">
        <ViewContact />
      </div>
    </>
  )
}

export default Contact