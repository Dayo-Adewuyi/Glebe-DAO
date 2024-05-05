import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"
import AssetCard from "./AssetCard"

const  Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Recent Asset Listings' subtitle='Browse through our freshest listings and invest with confidence' />
          <RecentCard />
        </div>
        <div className='container'>
          <Heading title='Your Assets' subtitle='' />
          <AssetCard />
        </div>
      </section>
    </>
  )
}

export default Recent
