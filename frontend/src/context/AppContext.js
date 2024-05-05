import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  GLEBE_DAO,
  GLEBE_DAO_ABI,
  GLEBE_ESTATE,
  GLEBE_ESTATE_ABI,
} from "../constants/constants";

export const AppContext = React.createContext();

const { ethereum } = window;

const getDAOContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const daoContract = new ethers.Contract(GLEBE_DAO, GLEBE_DAO_ABI, signer);
    return daoContract;
  } catch (error) {
    console.error("Error getting DAO contract:", error);
    throw error;
  }
};

const getEstateContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const estateContract = new ethers.Contract(GLEBE_ESTATE, GLEBE_ESTATE_ABI, signer);
  
    return estateContract;
  } catch (error) {
    console.error("Error getting estate contract:", error);
    throw error;
  }
};

const listAsset = async ({ owner, amount, price, imageUri, description, location }) => {
  try {
    const estate = await getEstateContract();
    return await estate.listAsset(owner, amount, price, imageUri, description, location);
  } catch (error) {
    console.error("Error listing asset:", error);
    throw error;
  }
};

const buyAsset = async ({ assetOwner, buyer, tokenId, amount, totalPrice }) => {
  try {
    console.log(totalPrice)
    const estate = await getEstateContract();
    return await estate.transfer(assetOwner, buyer, tokenId, amount, {
      value: ethers.utils.parseEther(totalPrice)
    });
  } catch (error) {
    console.error("Error buying asset:", error);
    throw error;
  }
};

const withdrawDividends = async (tokenId) => {
  console.log(tokenId)
  try {
    const estate = await getEstateContract();
    return await estate.withdrawDividends(tokenId);
  } catch (error) {
    console.error("Error withdrawing dividends:", error);
    throw error;
  }
};

const checkBalance = async (owner, tokenId) => {
  try {
    const estate = await getEstateContract();
    return await estate.balanceOf(owner, tokenId);
  } catch (error) {
    console.error("Error checking balance:", error);
    throw error;
  }
};

const getListings = async () => {
  try {
    const estate = await getEstateContract();
    return await estate.getListings();
  } catch (error) {
    console.error("Error getting listings:", error);
    throw error;
  }
};

const createProposal = async ({ description, duration, shares, sharePrice, uri, location }) => {
  try {
    const dao = await getDAOContract();
    return await dao.createProposal(description, duration, shares, sharePrice, uri, location);
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};

const vote = async (proposalId, inSupport) => {
  try {
    const dao = await getDAOContract();
    return await dao.vote(proposalId, inSupport);
  } catch (error) {
    console.error("Error voting on proposal:", error);
    throw error;
  }
};

const executeProposal = async (proposalId) => {
  try {
    const dao = await getDAOContract();
    return await dao.vote(proposalId);
  } catch (error) {
    console.error("Error executing proposal:", error);
    throw error;
  }
};

const getProposals = async () => {
  try {
    const dao = await getDAOContract();
    return await dao.getProposals();
  } catch (error) {
    console.error("Error getting proposals:", error);
    throw error;
  }
};

const receiveRevenue = async (tokenId) => {
  try {
    const dao = await getDAOContract();
    return await dao.receiveRevenue(tokenId);
  } catch (error) {
    console.error("Error receiving revenue:", error);
    throw error;
  }
};

const declareDividends = async (tokenId) => {
  try {
    const dao = await getDAOContract();
    return await dao.declareDividends(tokenId);
  } catch (error) {
    console.error("Error declaring dividends:", error);
    throw error;
  }
};

export const AppProvider = ({ children }) => {
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Requesting access to accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setConnectedWallet(true);
        } else {
          // Handle case where user denies account access
          setConnectedWallet(false);
          setCurrentAccount("");
        }
      } else {
        alert("Please install MetaMask extension!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed when component mounts
    if (window.ethereum) {
      setConnectedWallet(true);
      window.ethereum.on("accountsChanged", (accounts) => {
        // Handle case where user changes accounts or disconnects
        if (accounts.length === 0) {
          setConnectedWallet(false);
          setCurrentAccount("");
        } else {
          setCurrentAccount(accounts[0]);
          setConnectedWallet(true);
        }
      });
    } else {
      setConnectedWallet(false);
      setCurrentAccount("");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        connectWallet,
        currentAccount,
        connectedWallet,
        listAsset,
        buyAsset,
        withdrawDividends,
        checkBalance,
        createProposal,
        executeProposal,
        declareDividends,
        getListings,
        getProposals,
        vote,
        receiveRevenue
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
