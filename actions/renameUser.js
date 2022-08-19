import axios from 'axios';
import { getCookie } from 'cookies-next';

/**
 * Action: Rename user
 * @url api/users
 * @method PUT
 * @param name - New name
 * @returns New name
 */
const renameUser = (name) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/api/users', { name }, { headers: { 'x-auth-token': getCookie('token') } })
			.then((res) => resolve({ msg: res.data.msg, name: res.data.name }))
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default renameUser;
