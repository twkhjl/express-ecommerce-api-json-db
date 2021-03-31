
const jsonwebtoken = require('jsonwebtoken');

const SECRET = process.env.SECRET;

function verifyToken(jwt) {

  let decoded = '';

  if (!jwt) {
    return Promise.resolve({ 'JsonWebTokenError': 'No JWT' });
  }
  try {
    decoded = jsonwebtoken.verify(jwt, SECRET);
  } catch (error) {
    return Promise.resolve({ 'JsonWebTokenError':"invalid token" });
  }

  return Promise.resolve(decoded);

}



const verifyJWT = async function (req, res, next) {
  const jwt = req.body.token;
  await verifyToken(jwt)
    .then(result => {
      if('JsonWebTokenError' in result){
        res.status(403).send(result);
        return;
      }
      next();
      
    })
    .catch(next);
};
module.exports = verifyJWT;