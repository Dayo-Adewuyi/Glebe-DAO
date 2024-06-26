import React from "react"
import Awards from "./awards/Awards" 
import Header from "../common/header/Header"
import Location from "./location/Location"
import Price from "./price/Price"
import Recent from "./recent/Recent"
import Team from "./team/Team"

const Home = () => {
  return (
    <>
      <Header/>
      <Recent />
      <Awards />
      <Location />
    </>
  )
}

export default Home
