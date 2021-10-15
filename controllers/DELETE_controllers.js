const db = require("../database/client.js");

/* DELETE  user specific  user by id.  */
const delete_one_user = async (req, res, next) => {
  const { id } = req.foundUser;

  const deleteUser = {
    text: `
    DELETE FROM users
    WHERE id=$1
    RETURNING *;`,
    values: [id],
  };

  try {
    const { rowCount } = await db.query(deleteUser);

    return res
      .status(200)
      .send(`Successfully deleted ${rowCount} item from DB with id "${id}"`);
  } catch (err) {
    next(err);
  }
};

module.exports = { delete_one_user };
