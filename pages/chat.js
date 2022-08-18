import * as cookie from 'cookie';
import { validate } from './api/auth/index';
import SideMenu from '../components/SideMenu';
import ChatWindow from '../components/ChatWindow';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const Chat = ({ userData }) => {
	const [user, setUser] = useState(userData);
	const [currentChat, setCurrentChat] = useState(null);
	const [changeList, setChangeList] = useState(true);
	const [newMessage, addMessage] = useState(null);
	const router = useRouter();
	const redirect = () => router.push('/');

	useEffect(() => {
		(async () => {
			await fetch('/api/socket');
			socket = io();

			socket.on('connect', () => {
				console.log('connected');
			});

			socket.on('message', (message) => {
				addMessage(message);
			});
		})();
	}, []);

	return (
		<div className="root">
			<SideMenu
				user={user}
				setUser={setUser}
				redirect={redirect}
				setChat={setCurrentChat}
				needChange={{
					value: changeList,
					set: setChangeList,
					clear: () => setChangeList(false),
				}}
			/>
			<ChatWindow
				chatid={currentChat}
				userid={user._id}
				setChatID={setCurrentChat}
				updateList={() => setChangeList(true)}
				newMessage={{ value: newMessage, clear: () => addMessage(null) }}
				socket={socket}
			/>
		</div>
	);
};

export const getServerSideProps = async ({ req: { headers } }) => {
	const token = headers.cookie ? cookie.parse(headers.cookie)['token'] : null;
	const res = await validate(token);
	const userData = JSON.parse(JSON.stringify(res));
	if (!userData) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
			props: {},
		};
	} else return { props: { userData } };
};

export default Chat;
