const express = require("express");
const app = require("../app.js");
const usersRouter = express.Router();
const usersController = require("../controllers/usersController.js");
const getOneUser = require("../middlewares/getOneUser.js");
const validatorRequirements = require("../middlewares/validatorRequirements");
const authentication = require("../middlewares/authentication");

/* extract all cb from usersController module*/
const {
  display_all_users,
  display_one_user,
  post_new_user,
  change_entire_user,
  change_only_specific_field_of_user,
  delete_one_user,
} = usersController;

/* attach mw and controllers to specific routes and methods*/

usersRouter
  .route("/:id")
  .get([getOneUser, display_one_user])
  .delete(getOneUser, delete_one_user)
  .put([authentication, validatorRequirements, getOneUser, change_entire_user])
  .patch([authentication, getOneUser, change_only_specific_field_of_user])
  .post([authentication, validatorRequirements, post_new_user]);

usersRouter.route("/").get(display_all_users);

module.exports = usersRouter;
