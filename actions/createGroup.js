import axios from 'axios';
import { getCookie } from 'cookies-next';

const createGroup = (name) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				'api/chats/',
				{ name, personal: false },
				{ headers: { 'x-auth-token': getCookie('token') } }
			)
			.then((res) =>
				resolve({ name: res.data.chat.name, id: res.data.chat._id, personal: false })
			)
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default createGroup;
