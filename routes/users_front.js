const bcrypt = require("bcrypt");
const authFrontUser = require("../middlewares/authFrontUser");

const FrontUserValidator = require("../validators/FrontUserValidator");

const verifyJWT = require("../middlewares/verifyJWT");

// global variables
const dataPath = "./data/users.json";

const userFrontRoutes = (app, fs) => {
  // helper methods
  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  // READ ALL
  app.get("/users/front", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      jsonObj = JSON.parse(data);
      jsonObj = jsonObj["front"];
      for (k in jsonObj) {
        delete jsonObj[k].password;
      }
      res.send(jsonObj);
    });
  });

  // READ SINGLE USER
  app.get("/users/front/:id", (req, res) => {
    const id = req.params["id"];

    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      let users = JSON.parse(data);
      users = Object.entries(users["front"]);
      let user = users.filter((arr) => {
        let k = arr[0];
        let v = arr[1];
        return v.id == id;
      })[0];

      // ["id",{user json data}]
      user = user[1];
      delete user.password;
      res.send(user);
    });
  });

  // CREATE
  app.post("/users/front", (req, res) => {
    readFile((data) => {
      let users = data["front"];
      let newUser = req.body;

      // validation
      const validateResult = FrontUserValidator.checkNewUser(users, newUser);
      if (Object.keys(validateResult).length > 0) {
        res.status(403).send({
          hasError: true,
          error: validateResult,
        });
        return;
      }
      //END validation

      // Note: this isn't ideal for production use.
      // ideally, use something like a UUID or other GUID for a unique ID value
      const newUserId = Date.now().toString();

      newUser.id = newUserId;
      newUser.email = newUser.email.trim();
      newUser.password = bcrypt.hashSync(`${newUser.password}`, 11);

      // add new user
      data["front"][newUserId] = newUser;

      writeFile(JSON.stringify(data, null, 2), () => {
        delete newUser.password;

        res.status(200).send({
          result: "new user added",
          user: newUser,
        });
      });
    }, true);
  });

  // UPDATE USER INFORMATION
  app.put("/users/front/:id", (req, res) => {
    readFile((data) => {
      const userId = req.params.id;
      let users = data["front"];
      let user = req.body;

      // validation
      const validateResult = FrontUserValidator.checkUpdateUser(user, users);

      if (validateResult.error) {
        res.status(403).send({
          hasError: true,
          error: validateResult.error,
        });
        return;
      }
      //END validation

      // update user
      for (k in user) {
        data["front"][userId][k] = user[k];
      }
      writeFile(JSON.stringify(data, null, 2), () => {
        delete user.password;
        user.id = userId;

        res.status(200).send({
          result: "user profile updated(password left unchanged)",
          user: user,
        });
      });
    }, true);
  });

  // UPDATE USER password
  app.put("/users/front/update_password/:id", (req, res) => {
    readFile((data) => {
      const userId = req.params.id;
      let users = data["front"];
      let user = req.body;

      // validation
      const validateResult = FrontUserValidator.chkUserPassword(user);

      if (validateResult.error) {
        res.status(403).send({
          hasError: true,
          error: validateResult.error,
        });
        return;
      }
      //END validation

      // update user
      users[userId].password = bcrypt.hashSync(`${user.password}`, 11);

      writeFile(JSON.stringify(data, null, 2), () => {
        delete user.password;
        user.id = userId;

        res.status(200).send({
          result: "user password updated",
        });
      });
    }, true);
  });

  // DELETE
  app.delete("/users/front/:id", (req, res) => {
    readFile((data) => {
      // delete user
      const userId = req.params["id"];
      delete data["front"][userId];

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`users id:${userId} removed`);
      });
    }, true);
  });

  //front user login
  app.post("/login/front", authFrontUser,function(req,res,next){
		if(req.result.error) {res.send(req.result);return;}

		// get front user name
		fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
				res.send({error:err});return;
      }
      let jsonObj = JSON.parse(data);
      jsonObj = jsonObj["front"];
			
      for (k in jsonObj) {
				if(jsonObj[k].email==req.result.email) {
					
					delete jsonObj[k].password;
					let output = Object.assign(jsonObj[k],req.result);
					res.send(output);
					return;
				}
      }
    });


	});

  //verify JWT
  app.post(
    "/jwt/front",
    function (req, res, next) {
      req.tokenType = "front";
      next();
    },
    verifyJWT,
    function (req, res, next) {
      res.send({ pass: "jwt token valid" });
    }
  );
};

module.exports = userFrontRoutes;
