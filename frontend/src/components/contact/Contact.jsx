import React, { useState, useContext } from "react";
import img from "../images/pricing.jpg";
import Back from "../common/Back";
import "./contact.css";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import {ethers} from 'ethers'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button
} from '@chakra-ui/react'
import Header from "../common/header/Header";

const Contact = () => {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(null);
  const [shares, setShares] = useState(null);
  const [sharePrice, setSharePrice] = useState(null);
  const [uri, setUri] = useState("");
  const [location, setLocation] = useState("");
  const { createProposal } = useContext(AppContext);

  const isError = description === ''
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(description, duration, shares, sharePrice, uri, location)
     
      await createProposal({description, duration, shares, sharePrice: ethers.utils.parseEther(sharePrice), uri, location});
      toast.success("proposal created successfully",{
        position: "bottom-center"
      })
    } catch (error) {
      console.error("Error creating proposal:", error);
    
    }
  };

  return (
    <>
     <Header/>
      <section className='contact mb'>
        <div className='container'>
          <form className='shadow' onSubmit={handleSubmit}>
            <h4>Create A Proposal</h4> <br />
            <div>
            <FormControl isInvalid={isError}>
      <FormLabel>Description</FormLabel>
      <Input type='text'  value={description} onChange={(e) => setDescription(e.target.value)} />
      {!isError ? (
        <FormHelperText>
          Proposal Description
        </FormHelperText>
      ) : (
        <FormErrorMessage>Description is required.</FormErrorMessage>
      )}
       <FormLabel>Share Volume</FormLabel>
  <Input type='number' value={shares} onChange={(e) => setShares(e.target.value)}  />
 
  <FormLabel>Share Price</FormLabel>
  <Input type='number'  value={sharePrice} onChange={(e) => setSharePrice(e.target.value)}  />
 

  <FormLabel>Image Link</FormLabel>
  <Input type='text'  value={uri} onChange={(e) => setUri(e.target.value)} />
  

  <FormLabel>Location</FormLabel>
  <Input type='text'  value={location} onChange={(e) => setLocation(e.target.value)} />
 
  <FormLabel>Duration</FormLabel>
  <Input type='text' placeholder='' value={duration} onChange={(e) => setDuration(e.target.value)} />
 
    </FormControl>
          
            </div>
            <Button type='submit' onClick={handleSubmit}>Submit Proposal</Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
