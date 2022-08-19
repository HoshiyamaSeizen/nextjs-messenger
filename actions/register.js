import axios from 'axios';
import { setCookie } from 'cookies-next';

/**
 * Action: Create new user
 * @url api/users
 * @method POST
 * @param name - Username
 * @param email - Email
 * @param password - Password
 * @param password1 - Password confirmation
 * @returns Created user
 */
const register = (name, email, password, password1) => {
	return new Promise((resolve, reject) => {
		axios
			.post('api/users', { name, email, password, password1 })
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

export default register;
