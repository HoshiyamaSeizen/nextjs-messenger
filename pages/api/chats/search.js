import dbConnect from '../../../mongo/dbConnect';
import Chat from '../../../mongo/models/Chat';
import User from '../../../mongo/models/User';
import apiError from '../../../middleware/apiError';
import auth from '../../../middleware/auth';

const handler = async (req, res) => {
	const {
		method,
		query: { starts },
	} = req;
	await dbConnect;

	try {
		switch (method) {
			/** Search chats */
			case 'GET':
				auth(req, res, async () => {
					// Find user
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					// Load user chats
					const chats = [];
					for await (const cid of user.chats) {
						// Find chat
						const chat = await Chat.findById(cid);
						if (chat.personal && chat.members.length == 2) {
							// If chat is personal, name of chat = name of other user
							const uid = chat.members[0] !== +req.id ? chat.members[0] : chat.members[1];
							const target = await User.findById(uid).select('name');
							chats.push({
								name: target.name,
								_id: target._id, // Visible id = id of other user
								personal: true,
								dbid: chat._id, // Actual id = id of the chat
							});
						} else
							chats.push({
								name: chat.name,
								_id: chat._id,
								personal: false,
								dbid: chat._id, // Visible and actual ids are the same
							});
					}

					// If not search query given return just user chats
					if (!starts) return res.json({ userChats: chats });

					// Filter user chats
					const userChats = chats.filter(({ name }) =>
						name.toLowerCase().startsWith(starts.toLowerCase())
					);

					// Find all chats meeting the search query
					const globalChatsUnfiltered = await Chat.find({
						personal: false,
						name: { $regex: new RegExp(`^${starts}`, 'gi') },
					}).select('name _id personal');

					// Filter global chats
					const globalChats = globalChatsUnfiltered
						.filter((chat) => !user.chats.includes(chat._id))
						.map((chat) => {
							return {
								name: chat.name,
								_id: chat._id,
								personal: false,
								dbid: chat._id,
							};
						});

					return res.json({ userChats, globalChats });
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
