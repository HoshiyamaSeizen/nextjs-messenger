import axios from 'axios';
import { getCookie } from 'cookies-next';

const renameUser = (payload) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/api/users', payload, { headers: { 'x-auth-token': getCookie('token') } })
			.then((res) => resolve({ msg: res.data.msg, name: res.data.name }))
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default renameUser;
