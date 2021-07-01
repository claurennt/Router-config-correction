const db = require("../database/client");

/* Middleware to get one user from the db based of the matching with param id */
const getOneUser = (req, res, next) => {
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

  /* execute query on db and send back error or pass on successful req */
  db.query(findUserById)
    .then((data) => {
      if (!data.rows.length) {
        res.status(404).send("This user id does not exist");
      }
      /* the user we get from the query which is stored in data.rows[0] willbe assigned to the war req.user */
      req.foundUser = data.rows[0];
      console.log({ foundUser: req.foundUser });
      /* we call next so that we can move on to the next mw bc successful */
      next();
    })
    .catch((err) => next(err));
};

module.exports = getOneUser;
