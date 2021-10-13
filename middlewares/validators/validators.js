const express = require("express");

const { body } = require("express-validator");

const validatorRequirements = [
  body(
    ["first_name", "last_name"],
    "please provide a first name and last name of at least 2 characters"
  )
    .not()
    .isEmpty()
    .isLength({ min: 2 }),
];

module.exports = validatorRequirements;
