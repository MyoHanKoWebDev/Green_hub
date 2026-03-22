import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import ViewOrder from '../../components/order/ViewOrder';

const Orders = () => {
  return (
    <>
      <PageMeta
        title="Order Management | GreenHub Admin"
        description="Manage secure orders for GreenHub"
      />

      <div className="space-y-6">
        <ViewOrder />
      </div>
    </>
  )
}

export default Orders;