const express = require("express");
const app = require("../app.js");
const usersRouter = express.Router();
const usersController = require("../controllers/usersController.js");
const getOneUser = require("../middlewares/getOneUser.js");
const validatorRequirements = require("../middlewares/validatorRequirements");
const authentication = require("../middlewares/authentication");
/* mount middlewares to this specific path and for specific actions*/

/* extract all cb from usersController module*/
const {
  displayAllUsers,
  displayOneUser,
  postNewUser,
  changeEntireUser,
  changeOnlySpecificFieldOfUser,
  deleteOneUser,
} = usersController;

usersRouter
  .route("/:id?")
  .delete(getOneUser)
  .put([authentication, validatorRequirements, getOneUser])
  .patch([authentication, getOneUser])
  .post([authentication, validatorRequirements]);

/* GET users listing. */
usersRouter.get("/", displayAllUsers);

/* GET one specific  user by id. */
usersRouter.get("/:id", getOneUser, displayOneUser);

/* POST new user with validationRequirements mw mounted before */
usersRouter.post("/", postNewUser);

/* PUT entire user with validationRequirements mw mounted before */
usersRouter.put("/:id", changeEntireUser);

/* PATCH specific field of user  */
usersRouter.patch("/:id", changeOnlySpecificFieldOfUser);

/* DELETE  user specific  user by id.  */
usersRouter.delete("/:id", deleteOneUser);

module.exports = usersRouter;
