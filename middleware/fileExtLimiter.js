const path = require("path");
const fs = require("fs");

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const input_file = req.file;

    const fileExtensions = [];
    fileExtensions.push(path.extname(input_file.originalname));

    // Are the file extension allowed?
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
          ",",
          ", "
        );

      // delete read user file
      fs.unlinkSync(input_file.path);

      return res.status(422).json({ status: "error", message });
    }

    next();
  };
};

module.exports = fileExtLimiter;
