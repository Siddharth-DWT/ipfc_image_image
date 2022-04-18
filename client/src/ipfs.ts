import { create, IPFSHTTPClient } from "ipfs-http-client";

let ipfs: IPFSHTTPClient | undefined;
try {
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}

export default ipfs;
