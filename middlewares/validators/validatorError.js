const { validationResult } = require('express-validator');

const validateError = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Response will contain something like
    // { errors: [ "body[password]: must be at least 10 chars long" ] }
    return res.json({ errors: result.array() });
  }

  next();
};

module.exports = validateError;
