import axios from 'axios';
import { setCookie } from 'cookies-next';

/**
 * Action: Authenticate user
 * @url api/auth
 * @method POST
 * @param email - Email
 * @param password - Password
 * @returns User info
 */
const login = (email, password) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/api/auth', { email, password })
			.then((res) => {
				const { msg, token, user } = res.data;
				if (token) {
					setCookie('token', token, { maxAge: 60 * 60 * 24 });
					resolve({ msg, user });
				}
			})
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default login;
