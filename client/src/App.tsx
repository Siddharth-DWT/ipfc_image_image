import React, { Component, useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { CID, IPFSHTTPClient } from "ipfs-http-client";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import "./App.css";

const App = () => {
  const [storageValue, setStorageValue] = useState<number>(5);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [images, setImages] = useState<{ cid: CID; path: string }[]>([]);

  const runExample = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const response = await (contract as any).methods.get().call();
    await (contract as any).methods.set(10).send({ from: accounts[0] });
    setAccounts(accounts[0]);
    setStorageValue(response);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const filesAsArray = Array.from(files);
    console.log("filesAsArray", filesAsArray);
    filesAsArray.forEach(async (file: any) => {
      console.log("file in loop", file);
      const result = await (ipfs as IPFSHTTPClient).add(file);
      console.log("result", result);
      setImages([
        ...images,
        {
          cid: result.cid,
          path: result.path,
        },
      ]);
      console.log("images :", images);
    });
    console.log("images after :", images);
  };

  useEffect(() => {
    const get = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = (SimpleStorageContract as any).networks[networkId];
        const instance = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork && deployedNetwork.address);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
        runExample();
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    };
    get();
  }, []);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  const handleMintNFT = () => {
    console.log("minting start...");
    if (!contract) {
      console.log("contract is not available --contract-", contract);
    } else {
      console.log("contract found --contract-", contract);
      // contract.methods.safeMint(account).send({ from: accounts, value: "10000000000000000000" });
    }
  };
  // 0x26cd2bae73293c77891d4436c057dfef3a375b8d;
  return (
    <div className="App">
      {accounts ? <p style={{ color: "green" }}>Connected Account : {accounts}</p> : <p>Connect to Blockchain Network</p>}

      <div>Stored value: {storageValue}</div>

      <h1>IPFS Upload Files DApp</h1>

      <p>This image is uploaded on IPFS and etherium blockchain</p>

      <form onSubmit={onSubmit}>
        <input type="file" multiple />
        <input type="submit" />
      </form>
      {images.length ? <p style={{ color: "green" }}>{images.length} files have been uploaded successfully</p> : <p>No files have been uploaded</p>}
      {images.length ? images.map((image, index) => <img height={250} width={250} key={image.path} src={`https://ipfs.io/ifps/${image.path}`} alt={`Uploaded #${index + 1}`} />) : null}
      <br />
      <p>-------------------------------------------------</p>
      <br />

      <button onClick={handleMintNFT}>MINT NFT</button>
    </div>
  );
};

export default App;
