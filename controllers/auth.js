const bcrypt = require('bcrypt');
const User = require('../models/user');
const { buildToken } = require('../lib/token');

/**
 * Sign up a new user
 */
async function signUp(req, res) {
	try {
		const user = await User.create({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			role: 'PLAYER',
			score: 100,
		});

		const token = buildToken(user);
		res.status(201).json({ token });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}