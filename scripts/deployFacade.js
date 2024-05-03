/* global ethers hre */
/* eslint prefer-const: "off" */

const TURNSTILE = "0xEcf044C5B4b867CFda001101c617eCd347095B44"
async function deployFacade () {  

  const GlebeToken = await ethers.getContractFactory('GlebeToken')
  const glebeToken = await GlebeToken.deploy()
  await glebeToken.deployed()
  console.log('glebeToken deployed:', glebeToken.address)

  const GlebeEstate= await ethers.getContractFactory('GlebeEstate')
  const glebeEstate = await GlebeEstate.deploy( TURNSTILE)
  await glebeEstate.deployed()
  console.log('glebeEstate deployed:', glebeEstate.address)

  const GlebeGovernor = await ethers.getContractFactory('GlebeGovernor')
  const glebeGovernor = await GlebeGovernor.deploy(glebeEstate.address,glebeToken.address)
  await glebeGovernor.deployed()
  console.log('GlebeGovernor deployed:', glebeGovernor.address)



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
    deployFacade()

    .then(() => process.exit(0))
    .catch(error => {
      console.trace(error)
      process.exit(1)
    })
}

exports.deployFacade = deployFacade
