const bcrypt = require('bcrypt');
const authUser = require('../middlewares/authUser');

const CpUserValidator = require('../validators/CpUserValidator');

const verifyJWT = require('../middlewares/verifyJWT');

// global variables
const dataPath = './data/users.json';


const userRoutes = (app, fs) => {

	// helper methods
	const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
		fs.readFile(filePath, encoding, (err, data) => {
			if (err) {
				throw err;
			}
			callback(returnJson ? JSON.parse(data) : data);
		});
	};

	const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

		fs.writeFile(filePath, fileData, encoding, (err) => {
			if (err) {
				throw err;
			}
			callback();
		});
	};

	// READ ALL
	app.get('/users/cp', (req, res) => {
		fs.readFile(dataPath, 'utf8', (err, data) => {
			if (err) {
				throw err;
			}
			jsonObj = JSON.parse(data);
			jsonObj = jsonObj['cp'];
			for (k in jsonObj) {
				delete jsonObj[k].password;
			}
			res.send(jsonObj);
		});
	});

	// READ SINGLE USER
	app.get('/users/cp/:id', (req, res) => {

		const id = req.params["id"];

		fs.readFile(dataPath, 'utf8', (err, data) => {
			if (err) {
				throw err;
			}
			let users = JSON.parse(data);
			users = Object.entries(users["cp"]);
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
	app.post('/users/cp', (req, res) => {

		readFile(data => {
			let users = data["cp"];
			let newUser = req.body;

			// validation
			const validateResult = CpUserValidator.checkNewUser(users, newUser);

			if (validateResult.error) {
				res.status(403).send({
					hasError: true,
					error: validateResult.error
				});
				return;
			}
			//END validation

			// Note: this isn't ideal for production use. 
			// ideally, use something like a UUID or other GUID for a unique ID value
			const newUserId = Date.now().toString();

			newUser.id = newUserId;
			newUser.username = newUser.username.trim();
			newUser.password = bcrypt.hashSync(`${newUser.password}`, 11);



			// add new user
			data["cp"][newUserId] = newUser;

			writeFile(JSON.stringify(data, null, 2), () => {

				delete newUser.password;

				res.status(200).send({
					result: 'new user added',
					user: newUser
				});
			});
		},
			true);
	});


	// UPDATE
	app.put('/users/cp/:id', (req, res) => {

		readFile(data => {
			const userId = req.params.id;
			let users = data['cp'];
			let user = req.body;

			// validation
			const validateResult = CpUserValidator.checkUpdateUser(user);

			if (validateResult.error) {
				res.status(403).send({
					hasError: true,
					error: validateResult.error
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
					result: 'user updated',
					user: user
				});
			});
		},
			true);
	});


	// DELETE
	// app.delete('/users/cp/:id', (req, res) => {

	// 	readFile(data => {

	// 		// delete user
	// 		const userId = req.params["id"];
	// 		delete data["cp"][userId];

	// 		writeFile(JSON.stringify(data, null, 2), () => {
	// 			res.status(200).send(`users id:${userId} removed`);
	// 		});
	// 	},
	// 		true);
	// });

	//cp user login
	app.post('/login/cp', authUser);

	// verify jwt
	app.post('/jwt/cp', function (req, res, next) {
		req.tokenType = "cp";
		next();
	},
		verifyJWT,
		function (req, res, next) {
			res.send({ result: 'jwt token valid' });
		});
};

module.exports = userRoutes;
