import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const RecentCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getListings, buyAsset, currentAccount } = useContext(AppContext);
  const [buyAmount, setBuyAmount] = useState(null);
  const [listings, setListings] = useState(null);
  const [selectedListingIndex, setSelectedListingIndex] = useState(null);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const lists = await getListings();
      setListings(lists);
    } catch (e) {
      console.error("Error fetching listings:", e);
    }
  };

  const handleBuy = async () => {
    if (selectedListingIndex === null) {
      console.error("No listing selected to buy shares from");
      return;
    }
    const { owner, id, price } = listings[selectedListingIndex];

    await buyAsset({
      assetOwner:owner,
      buyer: currentAccount,
      tokenId: id,
      amount: buyAmount,
      totalPrice: ethers.utils.formatEther(buyAmount * price),
    });
    console.log("Buying", buyAmount, "shares of", id);
    onClose();

    // Show success toast
    toast.success("Shares bought successfully", {
      position: "bottom-center",
    });
  };
  console.log(listings)
  return (
    <>
      <div className="content grid3 mtop">
        { listings ? listings.map((val, index) => {
          const { amount, price, uri, description, location, id } = val;
          console.log(price)
          return (
            <div className="box shadow" key={index}>
              <div className="img">
                <img src={uri} alt="" />
              </div>
              <div className="text">
                <div className="category flex">
                  <span style={{ background: "#25b5791a", color: "#25b579" }}>
                    {" "}
                    Available Shares: {Math.floor((ethers.utils.formatEther(amount))*10**18)}
                  </span>
                </div>
                <h4>{description}</h4>
                <p>
                  <i className="fa fa-location-dot"></i> {location}
                </p>
              </div>
              <div className="button flex">
                <div>
                  <label htmlFor="">Price: {ethers.utils.formatEther(price)}</label>
                </div>
               
                <Button
                  onClick={() => {
                    setSelectedListingIndex(index); // Store the index of the selected listing
                    onOpen(); // Open the modal
                  }}
                >
                  Buy Shares
                </Button>
              </div>
            </div>
          );
        }): <p>no listing </p>}
      </div>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy Shares</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                ref={initialRef}
                placeholder=""
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleBuy()}>
              Buy
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecentCard;
