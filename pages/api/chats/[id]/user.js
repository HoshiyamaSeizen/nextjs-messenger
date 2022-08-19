import dbConnect from '../../../../mongo/dbConnect';
import Chat from '../../../../mongo/models/Chat';
import Info from '../../../../mongo/models/Info';
import User from '../../../../mongo/models/User';
import apiError from '../../../../middleware/apiError';
import auth from '../../../../middleware/auth';

const handler = async (req, res) => {
	const {
		method,
		query: { id },
	} = req;
	await dbConnect;

	try {
		// Load chat
		const chat = await Chat.findById(id);
		if (!chat) return apiError(res, 404, 'Chat not found');

		switch (method) {
			/** Add user to chat */
			case 'POST':
				auth(req, res, async () => {
					// Find user
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					// Check if user is already in the chat
					if (chat.members.includes(+req.id))
						return apiError(res, 400, 'You are already the member of the chat');

					// Add chat to user and save user
					user.chats.push(id);
					const savedUser = await user.save();
					if (!savedUser) return apiError(res, 400, 'User not found');

					// Add user to chat and save chat
					chat.members.push(req.id);
					const savedChat = await chat.save();
					if (!savedChat) return apiError(res, 500, 'Error while saving chat');

					res.json({ chat: savedChat });
				});
				break;
			/** Remove user from chat */
			case 'DELETE':
				auth(req, res, async () => {
					// Find user
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					// Check if user is already in the chat
					if (!chat.members.includes(+req.id))
						return apiError(res, 400, 'You are not the member of the chat');

					// If chat is personal and one leaves -> delete the chat
					if (chat.personal) {
						// Remove chat from users
						chat.members.forEach(async (uid) => {
							const member = await User.findById(uid);
							if (member) {
								member.chats = member.chats.filter((cid) => cid !== chat._id);
								await member.save();
							}
						});

						// Delete chat
						await Chat.findByIdAndDelete(id);

						// Get chats info
						const chatsInfo = await Info.findById('chatsInfo');
						if (!chatsInfo) return apiError(res, 500, 'Could not get chats info');

						// Update and save chats info
						chatsInfo.deleted++;
						const savedInfo = await chatsInfo.save();
						if (!savedInfo) return apiError(res, 500, 'Error while saving chats info');
						return res.json({ msg: 'chat deleted' });
					}

					// Remove chat from user
					user.chats = user.chats.filter((chat) => chat !== +id);
					const savedUser = await user.save();
					if (!savedUser) return apiError(res, 500, 'Error while saving user');

					// Remove user from chat
					chat.members = chat.members.filter((uid) => uid !== +req.id);
					const savedChat = await chat.save();
					if (!savedChat) return apiError(res, 500, 'Error while saving chat');

					res.json({ msg: 'exited the chat' });
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
