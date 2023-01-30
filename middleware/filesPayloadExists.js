const filesPayloadExists = (req, res, next) => {
  if (!req.files && !req.file)
    return res
      .status(400)
      .json({ status: "error", message: "please upload a file" });

  next();
};

module.exports = filesPayloadExists;
