import React, { useState, useEffect, useRef } from "react";
import { CID, IPFSHTTPClient } from "ipfs-http-client";
import getWeb3 from "./getWeb3";
import { ipfs, ipfsDag } from "./ipfs";
import ABI from "./MyNft.json";
import "./App.css";

const App = () => {
  const [storageValue, setStorageValue] = useState<number>(5);
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [uploadedFile, setUploadedFile] = useState<{ cid: CID; path: string }[]>([]);
  const ref = useRef<HTMLInputElement>(null);

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
    setAccounts(accounts[0]);
    setStorageValue(response);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;

    if (!files || files.length === 0) {
      return alert("No file selected");
    }

    const filesAsArray = Array.from(files);

    if (filesAsArray[0].webkitRelativePath === "") {
      // files or bunch of files

      // console.log("filesAsArray", filesAsArray);
      filesAsArray.forEach(async (file: any, index: number) => {
        //   console.log("file inside loop", file);
        const result = await (ipfs as IPFSHTTPClient).add(file);
        //   console.log("results-cid : ", result.cid);
        //   console.log("results-path : ", result.path);
        console.log(`full-url : https://ipfs.io/ipfs/${result.path}`);
        setUploadedFile([
          ...uploadedFile,
          {
            cid: result.cid,
            path: result.path,
          },
        ]);
      });
    } else {
      // folder

      await (ipfsDag as any).patch.addLink(
        files[1] as any,
        {
          name: "some-link",
          size: 10,
          multihash: "QmV49SZxAbe5gp5C6E8VkwXuSD7QdxRA1qjGgdFAVjMKSV",
        } as any
      );
    }

    //   filesAsArray.forEach(async (file: any, index: number) => {
    //     console.log("file", file);
    //     const result = await (ipfs as IPFSHTTPClient).add(
    //       {
    //         path: `images/${file.name}`,
    //         content: file,
    //       }
    //       //   { wrapWithDirectory: true }
    //     );
    //     console.log("result", result);
    //     console.log("results-cid : ", result.cid);
    //     console.log("results-path : ", result.path);
    //   });
    // }
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
      <h1>IPFS Upload file DApp</h1>
      <p>This image is uploaded on IPFS and etherium blockchain</p>
      <form onSubmit={onSubmit}>
        <input type="file" multiple ref={ref} />
        <input type="submit" className="button-62" />
      </form>
      {uploadedFile ? <p style={{ color: "green" }}>File has been uploaded successfully</p> : <p>No file have been uploaded till yet</p>}
      <br />
      {/* {uploadedFile && <p>Genearted Hash : {uploadedFile.path}</p>} */}
      <p>-------------------------------------------------</p>
      <br />
      <button onClick={handleMintNFT} className="button-62">
        MINT NFT
      </button>
    </div>
  );
};

export default App;
