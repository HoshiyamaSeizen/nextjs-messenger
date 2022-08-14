import dbConnect from '../../../../mongo/dbConnect';
import Chat from '../../../../mongo/models/Chat';
import Info from '../../../../mongo/models/Info';
import User from '../../../../mongo/models/User';
import apiError from '../../../../middleware/apiError';
import auth from '../../../../middleware/auth';
import mongoose from 'mongoose';

const handler = async (req, res) => {
	const {
		method,
		query: { id },
	} = req;
	await dbConnect;

	try {
		const chat = await Chat.findById(id);
		if (!chat) return apiError(res, 404, 'Chat not found');

		switch (method) {
			case 'GET':
				auth(req, res, async () => {
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					const isMember = chat.members.includes(+req.id);

					// Chat members info (only for members)
					const members = [];
					if (isMember)
						for await (const uid of chat.members) {
							const member = await User.findById(uid);
							if (member) members.push({ id: member._id, name: member.name });
						}

					// Change visible id and name for personal chats (change to target id and name)
					if (chat.personal && chat.members.length == 2) {
						const uid = chat.members[0] !== +req.id ? chat.members[0] : chat.members[1];
						const targetUser = await User.findById(uid).select('name');

						chat.dbid = chat._id;
						chat._id = targetUser.id;
						chat.name = targetUser.name;
					}

					const messages = isMember
						? chat.messages.map((msg) => {
								msg = msg.toObject();
								msg.time = msg.time.getTime();
								msg.own = msg.user === +req.id;
								return msg;
						  })
						: [];

					res.json({
						chat: {
							...chat.toObject(),
							messages,
							isCreator: chat.creator === +req.id,
							members,
							creationDate: chat.creationDate.getTime(),
						},
					});
				});
				break;
			case 'POST':
				auth(req, res, async () => {
					const { message } = req.body;
					if (!message) return apiError(res, 400, 'Empty message');

					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');
					if (!chat.members.includes(+req.id))
						return apiError(res, 403, 'You are not the member of the chat');

					const newMessage = {
						_id: mongoose.Types.ObjectId(),
						user: req.id,
						name: user.name,
						text: message,
						time: Date.now(),
					};
					chat.messages.push(newMessage);
					const savedChat = await chat.save();
					if (!savedChat) return apiError(res, 500, 'Error while saving chat');

					res.json({ message: { ...newMessage, own: true } });
				});
				break;
			case 'PUT':
				if (chat.personal) return apiError(res, 400, "Can't change personal chat name");
				auth(req, res, async () => {
					const newName = req.body.name;
					if (!newName) return apiError(res, 400, 'Please enter the name');

					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');
					if (chat.creator !== +req.id)
						return apiError(res, 403, 'You are not the owner of the chat');

					chat.name = newName;
					const savedChat = await chat.save();
					if (!savedChat) return apiError(res, 500, 'Error while saving chat');

					res.json({ msg: 'Chat name updated', name: savedChat.name });
				});
				break;
			case 'DELETE':
				auth(req, res, async () => {
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');
					if (!chat.personal && chat.creator !== +req.id)
						return apiError(res, 403, 'You are not the owner of the chat');

					chat.members.forEach(async (uid) => {
						const member = await User.findById(uid);
						if (member) {
							member.chats = member.chats.filter((cid) => cid !== chat._id);
							await member.save();
						}
					});

					await Chat.findByIdAndDelete(id);

					const chatsInfo = await Info.findById('chatsInfo');
					if (!chatsInfo) return apiError(res, 500, 'Could not get chats info');

					chatsInfo.deleted++;
					const savedInfo = await chatsInfo.save();
					if (!savedInfo) return apiError(res, 500, 'Error while saving chats info');

					res.json({ msg: 'Chat deleted' });
				});
				break;
			default:
				apiError(res, 405, 'Method not allowed');
				break;
		}
	} catch (e) {
		console.log(e.stack);
		apiError(res, 500, e.message);
	}
};

export default handler;
