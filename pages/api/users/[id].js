import dbConnect from '../../../mongo/dbConnect';
import User from '../../../mongo/models/User';
import apiError from '../../../middleware/apiError';

const handler = async (req, res) => {
	const {
		method,
		query: { id },
	} = req;
	dbConnect();

	try {
		switch (method) {
			/** Get user info (without chats) */
			case 'GET':
				const user = await User.findById(id).select('-password -__v -chats');
				if (!user) return apiError(res, 404, 'User not found');
				res.json(user);
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
