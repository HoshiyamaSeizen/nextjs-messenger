import dbConnect from '../../mongo/dbConnect';
import User from '../../mongo/models/User';

const handler = async (req, res) => {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			res.status(200).json('OK');
			break;
		case 'POST':
			const savedUser = await User.create(req.body);
			if (!savedUser) return res.status(500).json({ msg: 'Error while saving user' });
			res.json({
				msg: 'User created',
				user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
			});
			break;
		default:
			break;
	}
};

export default handler;
