import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [ currentAccount, setCurrentAccount ] = useState("");
   
  /*
    Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x40D024EEA2723c3E272CfE0bf4fc35153D9081Dc";

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;
  const [ waveCount, setWaveCount ] = useState(0);
  
  const checkIfWalletIsConnected = async()=>{
    try {
      /*
    * First make sure we have access to window.ethereum
    */
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
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

  /*
  * This runs our function when the page loads.
  */
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

  const wave = async () => {
    try {
      const { ethereum } = window;


      /* ethers is a library that helps our frontend talk to our contract
      */
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        /* Provider => talk to Ethereum nodes. 

Remember how we were using Alchemy to deploy? 
In this case we use nodes that Metamask provides in the background to send/receive data from our deployed contract.

*/
        const signer = provider.getSigner();

        /*
Signer => abstraction of an Ethereum Account.
- To sign messages and transactions, send signed transactions to the Ethereum Network to execute state changing operations.
*/

        /* contractAddress => Address of the contract deployed , contractABI => File in Artifacts

ABI file is something our web app needs to know how to communicate with our contract

*/
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setWaveCount(count);
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
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

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>


        <div className="user-wave-count">
            Total number of users waved at Harsha : { waveCount }
        </div>
        
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