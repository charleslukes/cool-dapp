import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

import "./App.css";

const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const tokenAddresss = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greetings, setGreetingsValue] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet();
        console.log("data ", data);
      } catch (error) {
        console.log("err", error);
      }
    }
  };

  const requestAccounts = async () => {
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const setGreetings = async () => {
    if (!greetings) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greetings);
      setGreetingsValue("");
      await transaction.wait();
      fetchGreeting();
    }
  };

  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const [accounts] = await requestAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddresss, Token.abi, provider);
      const balance = await contract.balanceOf(accounts);
      console.log("Balance ", balance.toString());
    }
  };

  const sendCoins = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddresss, Token.abi, signer);
      const transaction = await contract.transfer(userAddress, amount);
      await transaction.wait();
      console.log(`${amount} Coins Successfully sent to ${userAddress}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greetings</button>
        <button onClick={setGreetings}>Set Greetings</button>
        <input
          onChange={(e) => setGreetingsValue(e.target.value)}
          placeholder="Set greeting"
          value={greetings}
        ></input>
        <br />
        <h3>Coin Feature</h3>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coin</button>
        <input
          onChange={(e) => setUserAddress(e.target.value)}
          placeholder="Account Address"
        ></input>
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        ></input>
      </header>
    </div>
  );
}

export default App;
