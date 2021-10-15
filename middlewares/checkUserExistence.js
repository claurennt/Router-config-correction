const db = require("../database/client");

/* Get one user from the db based of the matching with param id */
const checkUserExistence = async (req, res, next) => {
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

  try {
    /* execute query on db and send back error or pass on successful req */
    const { rows } = await db.query(findUserById);

    if (!rows.length)
      return res.status(404).send("A user with this id does not exist");

    /* we attach the found user to the req and call next */
    req.foundUser = rows[0];

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkUserExistence;
