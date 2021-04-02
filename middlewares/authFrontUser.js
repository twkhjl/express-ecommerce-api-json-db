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
  users = users['front'];
  return Promise.resolve(users);


}


async function verifyUser(data) {
  const username = data.email;
  const password = data.password;
  let user = {};
  let userId = '';
  let passwordHash = "";
  let users = await getAllUsers();

  for (k in users) {
    if (users[k].email == username) {
      user.email = username;
      userId = k;
      passwordHash = users[k].password;
    }
  };
  if (!user.email) {
    return Promise.resolve({ error: 'user email not exist' });
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

      if (!result.email) {
        return res.json(result);
      }
      const SECRET_FRONT = process.env.SECRET_FRONT;
      const EXPIRES_IN = process.env.EXPIRES_IN;
      const token = jwt.sign(result, SECRET_FRONT, { expiresIn: EXPIRES_IN });
      return res.json({ token: token, expiresIn: EXPIRES_IN });
    })
    .catch(next);
}

module.exports = authUser;