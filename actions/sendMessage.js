import axios from 'axios';
import { getCookie } from 'cookies-next';

/**
 * Action: Send Message
 * @url api/chats/:chatid
 * @method POST
 * @param message - Message to be sent
 * @param chatid - Chat ID
 * @returns Message info
 */
const sendMessage = (message, chatid) => {
	return new Promise((resolve, reject) => {
		axios
			.post(
				`api/chats/${chatid}`,
				{ message },
				{ headers: { 'x-auth-token': getCookie('token') } }
			)
			.then((res) => resolve(res.data.message))
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default sendMessage;
