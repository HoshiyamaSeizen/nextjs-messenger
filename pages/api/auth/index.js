import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../mongo/dbConnect';
import User from '../../../mongo/models/User';
import auth from '../../../middleware/auth';
import apiError from '../../../middleware/apiError';

const handler = async (req, res) => {
	const { method } = req;
	await dbConnect();

	try {
		switch (method) {
			case 'GET':
				auth(req, res, async () => {
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');
					res.json({
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							chats: user.chats,
						},
					});
				});
				break;
			case 'POST':
				const { email, password } = req.body;

				// Basic validation
				if (!(email && password)) return apiError(res, 400, 'Please enter all fields');

				// Check if user exists
				const user = await User.findOne({ email });
				if (!user) return apiError(res, 400, 'There is not user with that email');

				// Check password
				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) return apiError(res, 400, 'Wrong password');

				// Create token
				const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: '1d',
				});
				if (!token) return apiError(res, 500, 'Error while generating a token');

				// Return user and token
				res.json({
					msg: 'User logged in',
					token,
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
						chats: user.chats,
					},
				});
				break;
			default:
				apiError(res, 405, 'Method not allowed');
		}
	} catch (e) {
		console.log(e.stack);
		apiError(res, 500, e.message);
	}
};

export default handler;

export const validate = async (token) => {
	if (!token) return false;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select('-password -__v');
		return user;
	} catch (e) {
		return false;
	}
};
