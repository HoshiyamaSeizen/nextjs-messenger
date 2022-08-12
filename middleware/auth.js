import jwt from 'jsonwebtoken';

// Authorization middleware
const auth = (req, res, next) => {
	//Get token
	const token = req.headers['x-auth-token'];
	if (!token) return res.status(400).json({ msg: 'Token not found. Authorization failed' });

	// Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.id = decoded.id; // Add user id from payload
		next();
	} catch (e) {
		res.status(400).json({ msg: 'Token is not valid' });
	}
};

export default auth;
