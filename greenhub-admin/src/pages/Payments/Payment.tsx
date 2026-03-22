import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import ViewPayment from '../../components/payment/ViewPyament';

const Payment = () => {
  return (
    <>
      <PageMeta
        title="Payment Management | GreenHub Admin"
        description="Manage secure payment methods for GreenHub"
      />

      <div className="space-y-6">
        <ViewPayment />
      </div>
    </>
  )
}

export default Payment;