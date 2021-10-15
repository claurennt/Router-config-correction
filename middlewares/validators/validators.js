const express = require("express");

const { body } = require("express-validator");

const validateBody = [
  body("first_name")
    .exists()
    .isLength({ min: 2 })
    .withMessage("First_name must be at least 2 characters"),
  body("last_name")
    .exists()
    .isLength({ min: 2 })
    .withMessage("Last_name must be at least 2 characters"),
];

// //body validator for the object array using a wildcard in case of multiple values added
// const validateBody = [
//   body("users.*.first_name")
//     .exists()
//     .isLength({ min: 2 })
//     .withMessage(
//       "First name is required and must be at least 2 characters long"
//     ),
//   body("users.*.last_name")
//     .exists()
//     .isLength({ min: 2 })
//     .withMessage(
//       "First name is required and must be at least 2 characters long"
//     ),
// ];

module.exports = validateBody;
