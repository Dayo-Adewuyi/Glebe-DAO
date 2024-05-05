import React from "react"
import { Heading } from "@chakra-ui/react"
import "./price.css"
import PriceCard from "./PriceCard"

const Price = () => {
  return (
    <>
      <section className='price padding'>
        <div className='container'>
        <Heading> PROPOSALS </Heading>
         <div>
         <PriceCard />
         </div>
        </div>
      </section>
    </>
  )
}

export default Price
