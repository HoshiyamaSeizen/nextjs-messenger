import axios from 'axios';
import { getCookie } from 'cookies-next';

const addGroup = (id) => {
	return new Promise((resolve, reject) => {
		axios
			.post(`api/chats/${id}/user`, {}, { headers: { 'x-auth-token': getCookie('token') } })
			.then((res) =>
				resolve({ name: res.data.chat.name, id: res.data.chat._id, personal: false })
			)
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default addGroup;
