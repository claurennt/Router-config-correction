const authentication = (req, res, next) => {
  const { token } = req.body;

  //if no token is sent with the body of the request or of the body is not the same as the env variable we return an error
  if (!token || token !== process.env.SECRET_TOKEN) {
    return res
      .status(401)
      .send("You do not have the permissions to perform this action");
  }

  //else we go to the next middleware
  next();
};

module.exports = authentication;
