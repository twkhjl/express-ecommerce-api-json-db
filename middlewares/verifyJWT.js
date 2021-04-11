
const jsonwebtoken = require('jsonwebtoken');

const secrets = {
"cp":  process.env.SECRET_CP,
"front":  process.env.SECRET_FRONT,
}


function verifyToken(jwt,type) {

  let decoded = '';
  if (!type) {
    return Promise.resolve({ 'JsonWebTokenError': 'jwt type blank' });
  }
  if (!Object.keys(secrets).includes(type)) {
    return Promise.resolve({ 'JsonWebTokenError': 'invlaid jwt type' });
  }
  if (!jwt) {
    return Promise.resolve({ 'JsonWebTokenError': 'jwt blank' });
  }
  try {
    decoded = jsonwebtoken.verify(jwt, secrets[type]);
  } catch (error) {
    return Promise.resolve({ 'JsonWebTokenError':"invalid jwt token" });
  }

  return Promise.resolve(decoded);

}



const verifyJWT = async function (req, res, next) {
  const jwt = req.body.token;
  //type should be one of the secrets props  e.g."cp"
  // const type = req.body.type;
  const type = req.tokenType;
  await verifyToken(jwt,type)
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