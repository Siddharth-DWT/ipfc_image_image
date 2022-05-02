import React, { useState, useEffect } from "react";
import { CID, IPFSHTTPClient } from "ipfs-http-client";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import "./App.css";
import ABI from "./MyNft.json";

const App = () => {
  const [storageValue, setStorageValue] = useState<number>(5);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [images, setImages] = useState<{ cid: CID; path: string }[]>([]);
  const [generatedHash, setGeneratedHash] = useState<string>();
  const ADDRESS = "0xCA79577D4767A968F7Daf8b19d9BAE4997E5d75b";

  const handleMintNFT = async () => {
    console.log("minting start...");
    if (accounts && contract) {
      console.log(accounts[0]);
      (contract as any).methods.mintNFT(accounts[0]).send({ from: accounts[0], value: "100000000000000000" });
    }
  };

  const runExample = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const response = await (contract as any).methods.get().call();
    // await (contract as any).methods.set(10).send({ from: accounts[0] });
    setAccounts(accounts[0]);
    setStorageValue(response);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;
    console.log("files", files);
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const filesAsArray = Array.from(files);
    filesAsArray.forEach(async (file: any, index: number) => {
      const result = await (ipfs as IPFSHTTPClient).add(file);
      console.log("results-cid : ", result.cid);
      console.log("results-path : ", result.path);

      setImages([
        ...images,
        {
          cid: result.cid,
          path: result.path,
        },
      ]);

      setGeneratedHash(result.path);
    });
  };

  useEffect(() => {
    const get = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(ABI, ADDRESS);
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

  // do not remove this line
  // 0xd9145CCE52D386f254917e481eB44e9943F39138
  return (
    <div className="App">
      {accounts ? <p style={{ color: "green" }}>Connected Account : {accounts}</p> : <p>Connect to Blockchain Network</p>}
      <div>Stored value: {storageValue}</div>
      <h1>IPFS Upload Files DApp</h1>
      <p>This image is uploaded on IPFS and etherium blockchain</p>
      <form onSubmit={onSubmit}>
        <input type="file" />
        <input type="submit" className="button-62" />
      </form>
      {images.length ? <p style={{ color: "green" }}>{images.length} files have been uploaded successfully</p> : <p>No files have been uploaded</p>}
      {images.length ? images.map((image, index) => <img height={250} width={250} key={image.path} src={`https://ipfs.io/ipfs/${image.path}`} alt={`Uploaded #${index + 1}`} />) : null}
      <br />
      {generatedHash && <p>Genearted Hash : {generatedHash}</p>}
      <p>-------------------------------------------------</p>
      <br />
      <button onClick={handleMintNFT} className="button-62">
        MINT NFT
      </button>
    </div>
  );
};

export default App;
