const express = require("express");
const app = require("../app.js");
const usersRouter = express.Router();

/* import controllers*/
const { create_new_user } = require("../controllers/POST_controllers.js");

const {
  display_all_users,
  display_one_user,
} = require("../controllers/GET_controllers.js");

const { change_entire_user } = require("../controllers/PUT_controllers.js");
const {
  change_only_specific_field_of_user,
} = require("../controllers/PATCH_controllers");
const { delete_one_user } = require("../controllers/DELETE_controllers.js");

const checkUserExistence = require("../middlewares/checkUserExistence");
const validateBody = require("../middlewares/validators/validators");
const validatorError = require("../middlewares/validators/validatorError");
const authentication = require("../middlewares/authentication");

const validationChain = [validateBody, validatorError];

/* attach mw and controllers to specific routes and methods*/
usersRouter
  .route("/:id")
  .get([checkUserExistence, display_one_user])
  .delete([authentication, checkUserExistence, delete_one_user])
  .put([
    authentication,
    checkUserExistence,
    validationChain,
    change_entire_user,
  ])
  .patch([
    checkUserExistence,
    authentication,
    validationChain,
    change_only_specific_field_of_user,
  ]);

usersRouter
  .route("/")
  .get(display_all_users)
  .post([authentication, validationChain, create_new_user]);

module.exports = usersRouter;
