const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let getAllUsers = () => {
  let users = '';
  const fs = require('fs');
  const filePath = './data/users.json';
  users = fs.readFileSync(filePath, 'utf8', (err, data) => {
    if (err) {
      return Promise.resolve({ error: err });
    }
    return JSON.parse(data);
  });

  users = JSON.parse(users);
  users = users['cp'];
  return Promise.resolve(users);


}


async function verifyUser(data) {
  const username = data.username;
  const password = data.password;
  let user = {};
  let userId = '';
  let passwordHash = "";
  let users = await getAllUsers();

  for (k in users) {
    if (users[k].username == username) {
      user.username = username;
      userId = k;
      passwordHash = users[k].password;
    }
  };
  if (!user.username) {
    return Promise.resolve({ error: 'user name not exist' });
  }
  if (!bcrypt.compareSync(`${password}`, passwordHash)) {
    return Promise.resolve({ error: 'password incorrect' });
  }

  user = users[userId];
  user.id = userId;
  if (user.password) delete user.password;
  return Promise.resolve(user);

}


const authUser = function (req, res, next) {
  const data = req.body;
  verifyUser(data)
    .then(result => {

      if (!result.username) {
        return res.json(result);
      }
      const SECRET_CP = process.env.SECRET_CP;
      const EXPIRES_IN = process.env.EXPIRES_IN;
      const token = jwt.sign(result, SECRET_CP, { expiresIn: EXPIRES_IN });
      req.jwt = { token: token, expiresIn: EXPIRES_IN };
      req.username = result.username;
      next();
      // return res.json({ token: token, expiresIn: EXPIRES_IN });
    })
    .catch(next);
}

module.exports = authUser;