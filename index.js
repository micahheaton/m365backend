const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const filterData = require("./routes/filterData");

const app = express();

// add other middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use("/", filterData);

// start app
const port = process.env.PORT || 3000;
const hostname = "localhost";
app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});

