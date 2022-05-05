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

let ipfsDag: IPFSHTTPClient | undefined;
try {
  ipfsDag = create({
    url: "https://ipfs.infura.io:5001/api/v0/dag",
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfsDag = undefined;
}
export { ipfs, ipfsDag };
