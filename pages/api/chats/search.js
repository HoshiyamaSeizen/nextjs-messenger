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
						chats.push({ name: chat.name, _id: chat._id });
					}

					if (!starts) return res.json({ userChats: chats });

					const userChats = chats.filter(({ name }) =>
						name.toLowerCase().startsWith(starts.toLowerCase())
					);
					const groupChats = await Chat.find({
						personal: false,
						name: { $regex: new RegExp(`^${starts}`, 'gi') },
					}).select('name _id');

					return res.json({ userChats, groupChats });
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
