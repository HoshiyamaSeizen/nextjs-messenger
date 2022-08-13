import * as cookie from 'cookie';
import { validate } from './api/auth/index';
import renameUserAction from '../actions/renameUser';
import deleteUserAction from '../actions/deleteUser';
import SideMenu from '../components/SideMenu';
import ChatWindow from '../components/ChatWindow';
import InfoMenu from '../components/InfoMenu';
import AddChatForm from '../components/AddChatForm';
import ProfileSettings from '../components/ProfileSettings';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Chat = ({ userData }) => {
	const [user, setUser] = useState(userData);
	const router = useRouter();
	const redirect = () => router.push('/');

	const renameUser = (newName) => {
		renameUserAction({ name: newName })
			.then(({ name }) => setUser({ ...user, name }))
			.catch((err) => console.log(err));
	};

	const deleteUser = () => {
		deleteUserAction()
			.then(() => redirect())
			.catch((err) => console.log(err));
	};

	return (
		<div className="root">
			<SideMenu user={user} redirect={redirect} />
			<ChatWindow />
			<InfoMenu />
			<AddChatForm />
			<ProfileSettings renameUser={renameUser} deleteUser={deleteUser} />
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
