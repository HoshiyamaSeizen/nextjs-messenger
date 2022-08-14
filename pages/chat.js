import * as cookie from 'cookie';
import { validate } from './api/auth/index';
import SideMenu from '../components/SideMenu';
import ChatWindow from '../components/ChatWindow';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Chat = ({ userData }) => {
	const [user, setUser] = useState(userData);
	const [currentChat, setCurrentChat] = useState(null);
	const [changeList, setChangeList] = useState(true);
	const router = useRouter();
	const redirect = () => router.push('/');

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
				setChatID={setCurrentChat}
				updateList={() => setChangeList(true)}
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
