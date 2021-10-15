const db = require("../database/client.js");

const change_only_specific_field_of_user = async (req, res, next) => {
  const { id } = req.foundUser;

  //retrieve changed fields from req.body
  const [key, value] = Object.entries(req.body)[0];

  const patchUser = {
    text: `
        UPDATE users
        SET ${key}=$1
        WHERE id=$2
        RETURNING *;`,
    values: [value, id],
  };

  try {
    const { rows } = await db.query(patchUser);
    return res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { change_only_specific_field_of_user };
