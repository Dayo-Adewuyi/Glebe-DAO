import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@chakra-ui/button";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const AssetCard = () => {

  const { getListings, withdrawDividends, currentAccount, checkBalance } = useContext(AppContext);
  const [listings, setListings] = useState(null);
  const [selectedListingIndex, setSelectedListingIndex] = useState(null);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleWithdrawal = async(index) => {
    try{
        const {id} = listings[index]
        await withdrawDividends(id)
        toast.success("dividends on the way")
    }catch (e){
        console.log(e)
        toast.error("no dividend available",{
            position: "bottom-center"
        })
    }
  }


  useEffect(() => {
    const fetchListings = async () => {
      try {
        const fetchedListings = await getListings(); // Fetch listings from your smart contract API
        const filteredListings = await filterListingsByBalance(fetchedListings);
        setListings(filteredListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  const filterListingsByBalance = async (listings) => {
    const filteredListings = [];
    for (const listing of listings) {
      const balance = await checkBalance(currentAccount, listing.id);
      if (balance > 0) {
        filteredListings.push(listing);
      }
    }
    return filteredListings;
  };
  return (
    <>
      <div className="content grid3 mtop">
        { listings ? listings.map((val, index) => {
          const { amount, price, uri, description, location, id } = val;
          return (
            <div className="box shadow" key={index}>
              <div className="img">
                <img src={uri} alt="" />
              </div>
              <div className="text">
                <div className="category flex">
                 
                </div>
                <h4>{description}</h4>
                <p>
                  <i className="fa fa-location-dot"></i> {location}
                </p>
              </div>
              <div className="button flex">
               
                <Button
                  onClick={() => {
                    setSelectedListingIndex(index); // Store the index of the selected listing
                    handleWithdrawal(index)
                  }}
                >
                  Withdraw Dividends
                </Button>
              </div> 
            </div>
          );
        }): <p>no listing </p>}
      </div>
    </>
  );
};

export default AssetCard;
