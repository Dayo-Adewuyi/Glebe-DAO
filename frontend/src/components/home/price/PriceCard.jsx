import React, { useState, useContext, useEffect } from "react";
import { price } from "../../data/Data";
import { ethers } from "ethers";
import { AppContext } from "../../../context/AppContext";
import { Button } from "@chakra-ui/button";
import "./ProposalCard.css";

const PriceCard = () => {
  const { getProposals, vote } = useContext(AppContext);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  console.log(proposals);
  const fetchListings = async () => {
    try {
      const lists = await getProposals();
      setProposals(lists);
    } catch (e) {
      console.error("Error fetching listings:", e);
    }
  };

  const extractTextAndURL = (description) => {
    // Regular expression to match the text and URL
    const regex = /(.*)(\(https?:\/\/[^\s]+\)?)$/;
    const match = description.match(regex);
    if (match && match.length === 3) {
      console.log();
      return {
        text: match[1].trim(),
        url: match[2].trim().replace(/[\(\)]/g, ""),
      };
    }
    return { text: description, url: null };
  };
  return (
    <>
      {proposals !== null &&
        proposals.map((item, index) => (
          <div className="proposal-card">
            {extractTextAndURL(item.description).url ? (
              <>
                <a
                  href={extractTextAndURL(item.description).url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>{extractTextAndURL(item.description).text}</p>
                </a>
              </>
            ) : (
              <p>{item.description}</p>
            )}

            <div className="details">
              <div className="price">
                Price Per Share: {ethers.utils.formatEther(item.price)} CANTO
              </div>
              <div className="shares">
                Available Shares:{" "}
                {ethers.utils.formatEther(item.shares) * 10 ** 18}
              </div>
            </div>
            <button className="vote-button">Support</button>
            <div>
              <Button colorScheme="red">Against</Button>
            </div>
          </div>
        ))}
    </>
  );
};

export default PriceCard;
