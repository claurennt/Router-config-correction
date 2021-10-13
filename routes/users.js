const express = require("express");
const app = require("../app.js");
const usersRouter = express.Router();

/* import controllers*/
 const {
  display_all_users,
  display_one_user,
  create_new_user,
  change_entire_user,
  change_only_specific_field_of_user,
  delete_one_user,
} = require("../controllers/users_controllers.js");


const checkUserExistence = require("../middlewares/checkUserExistence")
const validatorRequirements = require("../middlewares/validators/validators");
const authentication = require("../middlewares/authentication");




/* attach mw and controllers to specific routes and methods*/
usersRouter
  .route("/:id")
  .get([checkUserExistence, display_one_user])
  .delete([checkUserExistence, delete_one_user])
  .put([checkUserExistence, authentication, validatorRequirements, change_entire_user])
  .patch([authentication, change_only_specific_field_of_user])
 

usersRouter.route("/").get(display_all_users) .post([authentication, validatorRequirements, create_new_user]);;

module.exports = usersRouter;
