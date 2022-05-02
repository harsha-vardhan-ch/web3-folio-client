import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

const App = () => {

  const [ currentAccount, setCurrentAccount ] = useState("");

  const checkIfWalletIsConnected = async()=>{
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const { accounts } = await ethereum.request({method: "eth_accounts"});

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect (() => {
    checkIfWalletIsConnected();
  },[])

  const connectWallet = async() => {
    try{
      const { ethereum } = window;
      if(!ethereum)
      {
        alert("You need to Install MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected to account =>", accounts[0]);
      setCurrentAccount(accounts[0]);
      
    }catch(error){
      console.log(error);
    }
    
  }
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there! Welcome
        </div>

        <div className="bio">
        I am Harsha and I am currently pursuing my masters in Computer Science at USC. Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>


        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
      </div>
    </div>
  );
}

export default App;