import { useContext } from "react"
import React from "react"
import Heading from "../../common/Heading"
import "./hero.css"
import { Button } from "@chakra-ui/button"
import { AppContext } from "../../../context/AppContext"




const Hero = () => {

  const {connectWallet} = useContext(AppContext)

  return (
    <>
      <section className='hero'>
        <div className='container'>
        <Heading title='Discover fractional ownership opportunities in prime properties.' subtitle='connect wallet to get started' />
        <div className='wallet'>
        <Button colorScheme='blackAlpha' size='lg' onClick={connectWallet}>Connect Wallet</Button>
        </div>
        

        </div>
      </section>
    </>
  )
}

export default Hero
