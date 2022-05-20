const jsonwebtoken = require('jsonwebtoken');

function scanUser(req, res, next) {
  const header = req.header('Authorization');

  if (header == null) return res.status(403).send({ message: 'Invalid' });
  const token = header.split(' ')[1];
  if (token == null)
    return res.status(403).send({ message: "token can't be null" });

  jsonwebtoken.verify(token, process.env.TOKENPASSWORD, (err, tokenVerify) => {
    if (err) return res.status(403).send({ message: 'token invalid' + err });
    next();
  });
}

module.exports = { scanUser };
