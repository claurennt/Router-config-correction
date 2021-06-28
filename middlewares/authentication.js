const authentication = (req, res, next) => {
  const { token } = req.body;

  if (!token || token !== process.env.SECRET_TOKEN) {
    return res
      .status(401)
      .send("You do not have the permissions to perform this action");
  }
  res.sendStatus(202);
  next();
};

module.exports = authentication;
