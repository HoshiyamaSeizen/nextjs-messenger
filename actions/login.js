import axios from 'axios';
import { setCookie } from 'cookies-next';

const login = (payload) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/api/auth', payload)
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
