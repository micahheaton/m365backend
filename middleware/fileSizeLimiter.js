const fs = require("fs");

const MB = 5; // 5 MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const input_file = req.file;

  const filesOverLimit = [];
  // Which files are over the limit?
  if (input_file.size > FILE_SIZE_LIMIT) {
    filesOverLimit.push(input_file.originalname);
  }

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";

    const sentence =
      `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
        ",",
        ", "
      );

    const message =
      filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");

    // delete read user file
    fs.unlinkSync(input_file.path);

    return res.status(413).json({ status: "error", message });
  }

  next();
};

module.exports = fileSizeLimiter;
