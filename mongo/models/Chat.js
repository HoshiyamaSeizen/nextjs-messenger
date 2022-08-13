import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
	_id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	creator: {
		type: Number,
		required: true,
	},
	personal: {
		type: Boolean,
		required: true,
	},
	members: {
		type: [Number],
		default: [],
	},
	messages: {
		type: [
			{
				user: Number,
				text: String,
				time: Date,
			},
		],
		default: [],
	},
	creationDate: {
		type: Date,
		default: Date.now(),
	},
});

const Chat = mongoose.models.chat || mongoose.model('chat', chatSchema, 'chats');
export default Chat;
