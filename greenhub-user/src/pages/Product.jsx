import React from 'react'
import Productfilter from '../components/Productfilter'
import Heroimg from '../components/Heroimg'
import Footer from '../components/Footer'

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