import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	_id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	chats: {
		type: [Number],
		default: [],
	},
	registerDate: {
		type: Date,
		default: Date.now(),
	},
});

const User = mongoose.models.user || mongoose.model('user', userSchema, 'users');
export default User;
