const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const server = require("./app");

const dbconfig = require("./config/dbConfig");

const port = process.env.PORT_NUMBER || 3000;

server.listen(port, () => {
  console.log("listening to requests on PORT: " + port);
});
