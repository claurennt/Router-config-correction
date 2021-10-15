const db = require("../database/client.js");

/* callback to display all users */
const display_all_users = async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM users");
    return rows.length
      ? res.json(rows)
      : res.status(404).send("No users in the DB");
  } catch (err) {
    next(err);
  }
};

const display_one_user = async (req, res, next) => {
  // get the user from the middleware checkExistenceOfUser
  const { foundUser } = req;
  try {
    return res.send(200).json(foundUser);
  } catch (err) {
    next(err);
  }
};

module.exports = { display_all_users, display_one_user };
