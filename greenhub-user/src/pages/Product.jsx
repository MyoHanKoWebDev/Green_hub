import React from 'react'
import Productfilter from '../components/product/Productfilter'
import Heroimg from '../components/common/Heroimg'
import Footer from '../components/common/Footer'

const Product = () => {
  return (
    <>
    <Heroimg title="Eco-Friendly Products" desc="Discover eco-friendly products that support sustainable living. From
          reusable items to natural alternatives, GreenHub connects you with
          greener choices for a better future."/>
    <Productfilter />
    <Footer/>
    </> 
  )
}

export default Product