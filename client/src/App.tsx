import React, { Component, useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs.ts";
import "./App.css";

const App = () => {
  const [storageValue, setStorageValue] = useState(5);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [images, setImages] = useState([]);

  const runExample = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const response = await contract.methods.get().call();
    await contract.methods.set(10).send({ from: accounts[0] });
    setAccounts(accounts[0]);
    setStorageValue(response);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const files = e.target[0].files;
    (!files || files.length === 0) && alert("No files selected");
    const result = await ipfs.add(files[0]);
    setImages([
      ...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
  };

  useEffect(async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork && deployedNetwork.address);
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
      runExample();
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  }, []);

  useEffect(() => console.log(images), [images]);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      {accounts ? <p style={{ color: "green" }}>Connected Account : {accounts}</p> : <p>Connect to Blockchain Network</p>}

      <div>Stored value: {storageValue}</div>

      <h1>IPFS Upload Files DApp</h1>

      <p>This image is uploaded on IPFS and etherium blockchain</p>
      <img src="" alt=""></img>
      <form onSubmit={onSubmit}>
        <input type="file" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default App;
