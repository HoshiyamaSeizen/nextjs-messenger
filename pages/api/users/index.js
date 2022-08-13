import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../mongo/dbConnect';
import apiError from '../../../middleware/apiError';
import auth from '../../../middleware/auth';
import User from '../../../mongo/models/User';
import Info from '../../../mongo/models/Info';
import Chat from '../../../mongo/models/Chat';

const handler = async (req, res) => {
	const { method } = req;
	await dbConnect();

	try {
		switch (method) {
			case 'GET':
				const users = await User.find().select('-password -__v');
				if (!users) return apiError(res, 500, 'No user exist');
				res.json(users);
				break;
			case 'POST':
				const { name, email, password, password1 } = req.body;

				// Basic validation
				if (!(name && email && password && password1))
					return apiError(res, 400, 'Please enter all fields');
				if (password !== password1) return apiError(res, 400, 'Passwords should match');

				// Check if user already exists
				const user = await User.findOne({ email });
				if (user) return apiError(res, 400, 'User with that email already exists');

				// Hash password
				const salt = await bcrypt.genSalt(12);
				if (!salt) return apiError(res, 500, 'Something wrong with bcrypt.js');

				const hash = await bcrypt.hash(password, salt);
				if (!hash) return apiError(res, 500, 'Error while hashing the password');

				// Generate id
				const usersInfo = await Info.findById('usersInfo');
				if (!usersInfo) return apiError(res, 500, 'Could not get users info');

				const _id = usersInfo.added++;
				const savedInfo = await usersInfo.save(); // Updating users count
				if (!savedInfo) return apiError(res, 500, 'Error while saving users info');

				// Save user
				const newUser = new User({ _id, name, email, password: hash });
				const savedUser = await newUser.save();
				if (!savedUser) return apiError(res, 500, 'Error while saving user');

				// Create token
				const token = await jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET, {
					expiresIn: '1d',
				});
				if (!token) return apiError(res, 500, 'Error while generating a token');

				// Return created user and token
				res.json({
					msg: 'User created',
					token,
					user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
				});
				break;
			case 'PUT':
				auth(req, res, async () => {
					const newName = req.body.name;
					if (!newName) return apiError(res, 400, 'Please enter the name');

					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');
					user.name = newName;

					const savedUser = await user.save();
					if (!savedUser) return apiError(res, 500, 'Error while saving user');

					res.json({ msg: 'Username updated', name: savedUser.name });
				});
				break;
			case 'DELETE':
				auth(req, res, async () => {
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					await user.chats.forEach(async (cid) => {
						const chat = await Chat.findById(cid);
						if (chat) chat.members = chat.members.filter((uid) => uid !== +user._id);
						await chat.save();
					});

					await User.findByIdAndDelete(req.id);

					const usersInfo = await Info.findById('usersInfo');
					if (!usersInfo) return apiError(res, 500, 'Could not get users info');

					usersInfo.deleted++;
					const savedInfo = await usersInfo.save();
					if (!savedInfo) return apiError(res, 500, 'Error while saving users info');

					res.json({ msg: 'User deleted' });
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
