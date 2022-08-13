import * as cookie from 'cookie';
import { validate } from './api/auth/index';
import SideMenu from '../components/SideMenu';
import Chat from '../components/Chat';
import InfoMenu from '../components/InfoMenu';
import AddChatForm from '../components/AddChatForm';
import ProfileSettings from '../components/ProfileSettings';

const chat = ({ user }) => {
	return (
		<div className="root">
			<SideMenu user={user} />
			<Chat />
			<InfoMenu />
			<AddChatForm />
			<ProfileSettings />
		</div>
	);
};

export const getServerSideProps = async ({ req: { headers } }) => {
	const token = headers.cookie ? cookie.parse(headers.cookie)['token'] : null;
	const res = await validate(token);
	const user = JSON.parse(JSON.stringify(res));
	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
			props: {},
		};
	} else return { props: { user } };
};

export default chat;
