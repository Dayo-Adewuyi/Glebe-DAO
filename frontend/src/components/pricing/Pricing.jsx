import React from "react";
import PriceCard from "../home/price/PriceCard";
import img from "../images/pricing.jpg";
import { Center, Heading } from "@chakra-ui/react";
import "../home/price/price.css";
import Header from "../common/header/Header";

const Pricing = () => {
  return (
    <>
     <Header/>
      <section className='pricing mb'>
        <Center>
          <Heading>PROPOSALS</Heading>
        </Center>
        <div className='price container'>
          <PriceCard />
        </div>
      </section>
    </>
  );
};

export default Pricing;
