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
			case 'GET':
				auth(req, res, async () => {
					const user = await User.findById(req.id);
					if (!user) return apiError(res, 400, 'User not found');

					const chats = [];
					for await (const cid of user.chats) {
						const chat = await Chat.findById(cid);
						if (chat.personal && chat.members.length == 2) {
							const uid = chat.members[0] !== +req.id ? chat.members[0] : chat.members[1];
							const target = await User.findById(uid).select('name');
							chats.push({
								name: target.name,
								_id: target._id,
								personal: true,
								dbid: chat._id,
							});
						} else
							chats.push({
								name: chat.name,
								_id: chat._id,
								personal: false,
								dbid: chat._id,
							});
					}

					if (!starts) return res.json({ userChats: chats });

					const userChats = chats.filter(({ name }) =>
						name.toLowerCase().startsWith(starts.toLowerCase())
					);
					const globalChatsUnfiltered = await Chat.find({
						personal: false,
						name: { $regex: new RegExp(`^${starts}`, 'gi') },
					}).select('name _id personal');
					const globalChats = globalChatsUnfiltered.filter(
						(chat) => !user.chats.includes(chat._id)
					);

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
