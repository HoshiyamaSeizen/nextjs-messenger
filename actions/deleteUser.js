import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

const deleteUser = () => {
	return new Promise((resolve, reject) => {
		axios
			.delete('/api/users', { headers: { 'x-auth-token': getCookie('token') } })
			.then((res) => {
				deleteCookie('token');
				resolve({ msg: res.data.msg });
			})
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default deleteUser;
