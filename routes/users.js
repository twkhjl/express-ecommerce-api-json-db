const bcrypt = require('bcrypt');
const authUser = require('../middlewares/authUser');


const userRoutes = (app, fs) => {

	// variables
	const dataPath = './data/users.json';

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

	// READ ALL USERS
	app.get('/users', (req, res) => {
		fs.readFile(dataPath, 'utf8', (err, data) => {
			if (err) {
				throw err;
			}
			let users =JSON.parse(data);
			res.send(JSON.parse(data));
		});
	});

	// READ SINGLE USER
	app.get('/users/:id', (req, res) => {

		const userId = req.params["id"];

		fs.readFile(dataPath, 'utf8', (err, data) => {
			if (err) {
				throw err;
			}
			let users = JSON.parse(data);
			res.send(users[userId]);
		});
	});

	// CREATE
	app.post('/users', (req, res) => {

		readFile(data => {
			// Note: this isn't ideal for production use. 
			// ideally, use something like a UUID or other GUID for a unique ID value
			const newUserId = Date.now().toString();
			let newUser = req.body;

			newUser.id = newUserId;

			newUser.password = bcrypt.hashSync(`${newUser.password}`, 11);

			// add the new user
			data[newUserId.toString()] = newUser;

			writeFile(JSON.stringify(data, null, 2), () => {
				// res.status(200).send('new user added');
				res.status(200).send({
					result: 'new user added',
					user: newUser
				});
			});
		},
			true);
	});


	// UPDATE
	app.put('/users/:id', (req, res) => {

		readFile(data => {

			// add the new user
			const userId = req.params["id"];
			data[userId] = req.body;

			writeFile(JSON.stringify(data, null, 2), () => {
				res.status(200).send(`users id:${userId} updated`);
			});
		},
			true);
	});


	// DELETE
	app.delete('/users/:id', (req, res) => {

		readFile(data => {

			// add the new user
			const userId = req.params["id"];
			delete data[userId];

			writeFile(JSON.stringify(data, null, 2), () => {
				res.status(200).send(`users id:${userId} removed`);
			});
		},
			true);
	});

	// user login
	app.post('/login',authUser);
};

module.exports = userRoutes;
