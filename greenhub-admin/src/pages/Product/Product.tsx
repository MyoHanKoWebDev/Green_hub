import React from 'react'
import PageMeta from "../../components/common/PageMeta";
import ViewProduct from '../../components/product/ViewProduct';

const Product = () => {
  return (
    <>
      <PageMeta
        title="Product Management | GreenHub Admin"
        description="Manage secure products for GreenHub"
      />

      <div className="space-y-6">
        <ViewProduct />
      </div>
    </>
  )
}

export default Product;