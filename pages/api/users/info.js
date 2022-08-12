import dbConnect from '../../../mongo/dbConnect';
import Info from '../../../mongo/models/Info';
import apiError from '../../../middleware/apiError';

const handler = async (req, res) => {
	const { method } = req;
	await dbConnect();

	try {
		switch (method) {
			case 'GET':
				const usersInfo = await Info.findById('usersInfo');
				if (!usersInfo) throw Error('Could not get users info');
				res.json({
					users: usersInfo.added - usersInfo.deleted,
					added: usersInfo.added,
					deleted: usersInfo.deleted,
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
