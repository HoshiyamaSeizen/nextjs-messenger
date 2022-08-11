import SideMenu from '../components/SideMenu';
import Chat from '../components/Chat';
import InfoMenu from '../components/InfoMenu';
import AddChatForm from '../components/AddChatForm';
import ProfileSettings from '../components/ProfileSettings';

const chat = () => {
	return (
		<div className="root">
			<SideMenu />
			<Chat />
			<InfoMenu />
			<AddChatForm />
			<ProfileSettings />
		</div>
	);
};

export default chat;
