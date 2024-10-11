const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const dbconfig = require("./config/dbConfig");

const port = process.env.PORT_NUMBER || 3000;

app.listen(port, () => {
  console.log("listening to requests on PORT: " + port);
});
