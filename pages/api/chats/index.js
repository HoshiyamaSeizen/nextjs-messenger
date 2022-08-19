import dbConnect from '../../../mongo/dbConnect';
import Chat from '../../../mongo/models/Chat';
import Info from '../../../mongo/models/Info';
import User from '../../../mongo/models/User';
import apiError from '../../../middleware/apiError';
import auth from '../../../middleware/auth';

const handler = async (req, res) => {
	const { method } = req;
	await dbConnect;

	try {
		switch (method) {
			/** Get all chats */
			case 'GET':
				const chats = await Chat.find({ personal: false }).select('-members');
				res.json({ chats });
				break;
			/** Create new chat */
			case 'POST':
				auth(req, res, async () => {
					// Get fields
					let { name, personal, target } = req.body;
					if (
						(!name && personal === false) ||
						(target === undefined && personal) ||
						personal === undefined
					)
						return apiError(res, 400, 'Please enter all fields');

					// Get user
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					// Check target in personal chats
					let targetUser;
					if (personal) {
						const chat =
							(await Chat.findOne({ members: [req.id, target] })) ||
							(await Chat.findOne({ members: [target, req.id] }));
						if (chat) return apiError(res, 400, 'This personal chat already exists');

						name = 'chat';
						if (target === +req.id)
							return apiError(res, 400, 'User and target should not match');
						targetUser = await User.findById(target);
						if (!targetUser) return apiError(res, 400, 'Target user not found');
					}

					// Get chats info
					const chatsInfo = await Info.findById('chatsInfo');
					if (!chatsInfo) return apiError(res, 500, 'Could not get chats info');

					// Set id and update chats info
					const _id = chatsInfo.added++;
					const savedInfo = await chatsInfo.save(); // Updating chats count
					if (!savedInfo) return apiError(res, 500, 'Error while saving chats info');

					// Members
					const members = personal ? [req.id, target] : [req.id];

					// Save chat
					const newChat = new Chat({
						_id,
						name,
						creator: req.id,
						personal,
						members,
					});
					const savedChat = await newChat.save();
					if (!savedChat) return apiError(res, 500, 'Error while saving chat');

					// Add chat to users
					user.chats.push(savedChat._id);
					await user.save();
					if (personal) {
						targetUser.chats.push(savedChat._id);
						await targetUser.save();

						savedChat.dbid = savedChat._id;
						savedChat._id = targetUser.id;
						savedChat.name = targetUser.name;
					}

					res.json({
						msg: 'Chat created',
						chat: savedChat,
					});
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
