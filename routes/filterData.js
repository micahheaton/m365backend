const express = require("express");
const router = express.Router();
const Papa = require("papaparse");
const fs = require("fs");
const filesPayloadExists = require("../middleware/filesPayloadExists");
const fileSizeLimiter = require("../middleware/fileSizeLimiter");
const fileExtLimiter = require("../middleware/fileExtLimiter");
const multer = require("multer");
// file upload destination
var uploadDestination = "data/tmp/";
var upload = multer({ dest: uploadDestination });

// filter data of input csv file
router.post(
  "/filter-data",
  upload.single("input_file"),
  filesPayloadExists,
  fileExtLimiter([".csv"]),
  fileSizeLimiter,
  (req, res, next) => {
    const input_file = req.file;

    try {
      // ********* read user file ************
      const csvUserFile = fs.readFileSync(input_file.path, "utf8");
      const userDataResults = Papa.parse(csvUserFile, {
        header: true,
        dynamicTyping: true,
      });

      // delete read user file
      fs.unlinkSync(input_file.path);

      const input = userDataResults.data;

      // ********* read admin file ************
      const csvFile = fs.readFileSync("./data/data.csv", "utf8");
      const results = Papa.parse(csvFile, {
        header: true,
        dynamicTyping: true,
      });
      // ******** End read admin file *********

      const adminFileData = results.data.filter((el) => el["Type"] != null);

      let recommended = [];
      let highImpact = [];

      input.map((item) => {
        adminFileData.map((el) => {
          if (item["Recommended action"] == el["Recommended action"]) {
            if (el["Type"] == "Green") {
              recommended.push({ ...item, color: el["Type"] });
            } else {
              highImpact.push({ ...item, color: el["Type"] });
            }
          }
        });
      });

      res.status(200).json({ recommended, highImpact });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "something went wrong", error });
    }
  }
);

module.exports = router;
