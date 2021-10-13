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

try{


  /* execute query on db and send back error or pass on successful req */
  const  {rows} = await db.query(findUserById)
  
   if(!rows.length) return res.status(404).send("A user with this id does not exist");
        
      /* the user we get from the query which is stored in data.rows[0] willbe assigned to the war req.user */
      req.foundUser = rows;
    
      /* we call next so that we can move on to the next mw bc successful */
      next();
    } catch(err) { console.log(err)}
};

module.exports =  checkUserExistence;
