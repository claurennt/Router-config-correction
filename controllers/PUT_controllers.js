const db = require("../database/client.js");

const change_entire_user = async (req, res, next) => {
  /* retrieve the id from the req.foundUser coming from the checkExistenceOfUser mw */
  const { id } = req.foundUser;
  const { first_name, last_name } = req.body;

  const updateUser = {
    text: `
      UPDATE users
      SET first_name = $1, last_name=$2
      WHERE id=$3
      RETURNING *;`,
    values: [first_name, last_name, id],
  };
  try {
    const { rows } = await db.query(updateUser);
    return res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  change_entire_user,
};
