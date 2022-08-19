import axios from 'axios';
import { getCookie } from 'cookies-next';

/**
 * Action: Search chats
 * @url api/chats/search?starts={query}
 * @method GET
 * @param query - Search pattern
 * @returns found user chats and global chats
 */
const searchChats = (query = '') => {
	return new Promise((resolve, reject) => {
		axios
			.get(`/api/chats/search?starts=${query}`, {
				headers: { 'x-auth-token': getCookie('token') },
			})
			.then((res) =>
				resolve({ userchats: res.data.userChats, globalchats: res.data.globalChats })
			)
			.catch((err) => reject(err.response ? err.response.data.msg : 'Something went wrong'));
	});
};

export default searchChats;
