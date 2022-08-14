import axios from 'axios';
import { getCookie } from 'cookies-next';

const addPerson = (id) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				`api/chats/`,
				{ target: +id, personal: true },
				{ headers: { 'x-auth-token': getCookie('token') } }
			)
			.then((res) =>
				resolve({ name: res.data.chat.name, id: res.data.chat._id, personal: true })
			)
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default addPerson;
