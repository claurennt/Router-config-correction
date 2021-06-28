const express = require("express");
const app = require("../app.js");
const usersRouter = express.Router();
const db = require("../database/client.js");
const getOneUser = require("../middlewares/getOneUser.js");
const validatorRequirements = require("../middlewares/validatorRequirements");
const errorHandler = require("../middlewares/errorHandler");
const { validationResult } = require("express-validator");

// mount middlewares to this specific path and for specific actions
usersRouter
  .route("/:id?")
  .delete(getOneUser)
  .put(getOneUser)
  .patch(getOneUser)
  .post(validatorRequirements);

/* GET users listing. */
usersRouter.get("/", (req, res, next) => {
  db.query("SELECT * FROM users ORDER BY ID ASC;")
    .then((data) => res.json(data.rows))
    .catch((err) => next(err));
});

/* GET one particular user by id. */
usersRouter.get("/:id", getOneUser, (req, res) => {
  // send back to the user the data coming from the req handled in the mw, which is assigned from data.rows[0] for instance
  res.json(req.foundUser);
});

// post new user with validationRequirements mw mounted before
usersRouter.post("/", (req, res, next) => {
  const { first_name, last_name } = req.body;

  // catch validation result errors coming from validatorRequirements mw
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const createNewUser = {
    text: `
   INSERT INTO users (first_name, last_name)
   VALUES ($1, $2)
   RETURNING *;`,
    values: [first_name, last_name],
  };

  db.query(createNewUser)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => next(err));
});

usersRouter.put("/:id", (req, res, next) => {
  const { first_name, last_name } = req.body;

  // retrieve the id from the req.foundUser coming from the getOneUser mw
  const { id } = req.foundUser;

  // if the req.body does not contain both send an error
  if (!first_name || !last_name) {
    return res
      .status(400)
      .send("Please provide both first and last name in your request");
  }

  const updateUser = {
    text: `
    UPDATE users
    SET first_name = $1, last_name=$2
    WHERE id=$3
    RETURNING *;`,
    values: [first_name, last_name, id],
  };

  db.query(updateUser)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err));
});

usersRouter.patch("/:id", (req, res, next) => {
  // retrieve changed key value pair from req.body
  const changedField = Object.keys(req.body);
  const changedValue = Object.values(req.body)[0];

  const { id } = req.foundUser;

  // dinamically change column_name
  const patchUser = {
    text: `
    UPDATE users
    SET ${changedField}=$1
    WHERE id=$2
    RETURNING *;`,
    values: [changedValue, id],
  };

  db.query(patchUser)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err));
});

usersRouter.delete("/:id", (req, res, next) => {
  const { id } = req.foundUser;

  const deleteUser = {
    text: `
DELETE FROM users
WHERE id=$1
RETURNING *;`,
    values: [id],
  };

  db.query(deleteUser)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err));
});
module.exports = usersRouter;
