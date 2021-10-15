const db = require("../database/client.js");

/* controller to create new user */
const create_new_user = async (req, res, next) => {
  const { first_name, last_name } = req.body;

  const createNewUser = {
    text: `
       INSERT INTO users (first_name, last_name)
       VALUES ($1, $2)
       RETURNING *;`,
    values: [first_name, last_name],
  };

  try {
    const { rows } = await db.query(createNewUser);
    return res.status(201).json(rows);
  } catch (err) {
    next(err);
  }
};

/*TODO: controller to create multiple users at once*/
// const create_multiple_users = async (req, res, next) => {
//   const { users } = req.body;

//   const values = users.map((u) => {
//     return Object.values(u);
//   });

//   Object.values(users).map((v) => {
//     let;
//   });
//   const createMultipleUsers = {
//     text: `
//     INSERT INTO users (first_name, last_name)
//     VALUES ($1, $2)
//     RETURNING *;`,
//     values: [first_name, last_name],
//   };

//   try {
//     const { rows } = await db.query(createMultipleUsers);
//     return res.status(201).json(rows);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = { create_new_user };
