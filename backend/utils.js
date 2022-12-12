import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const { _id, email, name, isAdmin } = user;
  return jwt.sign({ _id, email, name, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
export default isAuth;
