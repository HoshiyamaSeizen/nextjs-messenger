import axios from 'axios';
import { getCookie } from 'cookies-next';

const exitChat = (id) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`api/chats/${id}/user`, { headers: { 'x-auth-token': getCookie('token') } })
			.then((res) => resolve(res.data))
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default exitChat;
