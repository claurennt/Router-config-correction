const db = require("../database/client.js");


const { validationResult } = require("express-validator");

/* callback to display all users */
const display_all_users = async (req, res, next) => {
  try {
    const {rows} = await db.query("SELECT * FROM users");
    return rows ? res.json(rows) : res.status(404).send("No users in the DB");
  } catch (err) {
    next(err);
  }
}

const display_one_user = async (req, res, next) => {
  const { id } = req.params;

  /* create findbyUser object with query text and respective valeus */
  const findUserById = {
    text: `
    SELECT *
    FROM users
    WHERE id=$1
    `,
    values: [id],
  };
try{
  /* execute query on db and send back error or pass on successful req */
 const {rows} = await db.query(findUserById)
 
    return rows ? res.json(rows) : res.status(404).send("No user(s) with that id");
  } catch (err) {
    next(err);
  }
  }

/* callback to post new user */
const create_new_user = (req, res, next) => {
  const { first_name, last_name } = req.body;

  

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
const change_entire_user = (req, res, next) => {
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

const change_only_specific_field_of_user = (req, res, next) => {
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
const delete_one_user = (req, res, next) => {
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
  display_all_users,
  display_one_user,
  create_new_user,
  change_entire_user,
  change_only_specific_field_of_user,
  delete_one_user,
};
