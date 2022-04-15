import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ifsc from "./ipfs";
import "./App.css";
import ipfs from "./ipfs";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null, ipfsHash: "" };

    this.handleCaptured = this.handleCaptured.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(SimpleStorageContract.abi, deployedNetwork && deployedNetwork.address);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    const web3 = await getWeb3();
    const accountsd = await web3.eth.getAccounts();
    this.setState({ account: accountsd[0] });
    const networkId = await web3.eth.net.getId();

    // Stores a given value, 5 by default.
    await contract.methods.set(10).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleCaptured(e) {
    // e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  }
  onSubmit(e) {
    e.preventDefault();
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.error("error in adding file", error);
        return true;
      }
      console.log("result", result);
      // return this.setState({ ipfsHash: result[0].hash });
    });
    console.log("submitted");
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <p>Your Truffle Box is installed and ready.</p>
        <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>

        <div>The stored value is: {this.state.storageValue}</div>

        <h1>IPFS Upload Files DApp</h1>
        <p>This image is uploaded on IPFS and etherium blockchain</p>
        <img src="" alt=""></img>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.handleCaptured} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
