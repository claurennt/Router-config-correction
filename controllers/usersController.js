const db = require("../database/client.js");

const errorHandler = require("../middlewares/errorHandler");
const { validationResult } = require("express-validator");

/* callback to display all users */
const displayAllUsers = (req, res, next) => {
  db.query("SELECT * FROM users ORDER BY ID ASC;")
    .then((data) => res.json(data.rows))
    .catch((err) => next(err));
};

/* callback to display specific user */
const displayOneUser = (req, res) => {
  // send back to the user the data coming from the req handled in the mw, which is assigned from data.rows[0] for instance
  res.json(req.foundUser);
};

/* callback to post new user */
const postNewUser = (req, res, next) => {
  const { first_name, last_name } = req.body;

  /* catch validation result errors coming from validatorRequirements mw */
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
};

/* callback to change entire user */
const changeEntireUser = (req, res, next) => {
  const { first_name, last_name } = req.body;

  /* retrieve the id from the req.foundUser coming from the getOneUser mw */
  const { id } = req.foundUser;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  /* if the req.body does not contain both send an error */
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
};

const changeOnlySpecificFieldOfUser = (req, res, next) => {
  /* retrieve changed key value pair from req.body */
  const changedField = Object.keys(req.body);
  const changedValue = Object.values(req.body)[0];

  const { id } = req.foundUser;

  /* dinamically change column_name */
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
};

/* DELETE  user specific  user by id.  */
const deleteOneUser = (req, res, next) => {
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
};

module.exports = {
  displayAllUsers,
  displayOneUser,
  postNewUser,
  changeEntireUser,
  changeOnlySpecificFieldOfUser,
  deleteOneUser,
};
