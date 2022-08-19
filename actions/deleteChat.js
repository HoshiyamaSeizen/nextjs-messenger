import axios from 'axios';
import { getCookie } from 'cookies-next';

/**
 * Action: Delete chat
 * @url api/chats/:id
 * @method DELETE
 * @param message - Message to be sent
 * @param chatid - Chat ID
 */
const deleteChat = (id) => {
	return new Promise((resolve, reject) => {
		axios
			.delete(`api/chats/${id}`, { headers: { 'x-auth-token': getCookie('token') } })
			.then((res) => resolve(res.data))
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default deleteChat;
