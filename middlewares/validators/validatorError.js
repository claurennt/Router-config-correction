const { validationResult } = require("express-validator");

const validatorError = (req, res, next) => {
  const result = validationResult(req);
  console.log(result);
  if (!result.isEmpty()) {
    // Response will contain something like
    // { errors: [ "body[password]: must be at least 10 chars long" ] }
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

module.exports = validatorError;
