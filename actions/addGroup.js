import axios from 'axios';
import { getCookie } from 'cookies-next';

/**
 * Action: Add group to user
 * @url api/chats/:id/user
 * @method POST
 * @param id - Chat ID
 * @returns Chat Info
 */
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
