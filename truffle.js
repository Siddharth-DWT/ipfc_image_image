const path = require("path");
module.export = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    host: "127.0.0.1",
    port: 7575,
    network_id: "*",
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
