// const IPFS = require("ipfs-http-client");
import { create } from "ipfs-http-client";
const ipfs = await create();
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
// const ipfs = new IPFS({ host: "ipfs.infura.io", port: "5001", protocol: "htpp" });
// const client = create();

export default ipfs;
