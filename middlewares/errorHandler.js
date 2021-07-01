const express = require("express");

/* create custom error handling middleware  */
const errorHandler = (err, req, res, next) => {
  /* console.log what was the actual error */
  console.log(err.stack);
  res.status(500).send("An error has occured. The admin has been informed");
};

module.exports = errorHandler;
