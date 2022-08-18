import { useEffect, useState } from 'react';
import { deleteCookie } from 'cookies-next';
import {
	faGear,
	faArrowRightFromBracket,
	faMagnifyingGlass,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddChatForm from './AddChatForm';
import ProfileSettings from './ProfileSettings';
import styles from '../styles/SideMenu.module.sass';
import renameUserAction from '../actions/renameUser';
import deleteUserAction from '../actions/deleteUser';
import searchChatsAction from '../actions/searchChats';

const SideMenu = ({ user, setUser, redirect, setChat, needChange }) => {
	const [tab, setTab] = useState('people');
	const [userchats, setUserChats] = useState([]);
	const [globalchats, setGlobalChats] = useState([]);
	const [search, setSearch] = useState('');

	// Load chats when or update
	useEffect(() => {
		if (!needChange.value) return;
		setSearch('');
		setGlobalChats([]);
		searchChatsAction()
			.then((res) => setUserChats(res.userchats))
			.catch((err) => console.log(err));
		needChange.clear();
	}, [needChange]);

	// Search chats
	const searchChats = () => {
		searchChatsAction(search)
			.then((res) => {
				setUserChats(res.userchats);
				setGlobalChats(res.globalchats || []);
			})
			.catch((err) => console.log(err));
	};
	const handleSearchChange = (e) => setSearch(e.target.value);

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

	const logout = () => {
		deleteCookie('token');
		redirect();
	};

	const isPeople = () => tab === 'people';
	const isGroups = () => tab === 'groups';

	const openChatModule = () =>
		document.getElementById('chat-add-module').setAttribute('opened', '');
	const openSettingsModule = () =>
		document.getElementById('settings-module').setAttribute('opened', '');

	return (
		<>
			<div className={styles.container}>
				<div className={styles.profile}>
					<p>
						{user.name}
						<span>#{(user._id + '').padStart(4, '0')}</span>
					</p>
					<button onClick={openSettingsModule}>
						<FontAwesomeIcon icon={faGear} />
					</button>
					<button onClick={logout}>
						<FontAwesomeIcon icon={faArrowRightFromBracket} />
					</button>
				</div>
				<div className={styles.searchBar}>
					<input
						type="text"
						name="search"
						placeholder="Search chat..."
						value={search}
						onChange={handleSearchChange}
					/>
					<button onClick={searchChats}>
						<FontAwesomeIcon icon={faMagnifyingGlass} />
					</button>
				</div>
				<div className={styles.tabSelect}>
					<button
						className={styles.tabPeople}
						chosen={isPeople().toString()}
						onClick={() => setTab('people')}
					>
						People
					</button>
					<button
						className={styles.tabGroups}
						chosen={isGroups().toString()}
						onClick={() => setTab('groups')}
					>
						Groups
					</button>
				</div>
				<div className={styles.chatListContainer}>
					<ul>
						{userchats.map((chat) =>
							(isPeople() && chat.personal) || (isGroups() && !chat.personal) ? (
								<li key={chat._id} onClick={() => setChat(chat.dbid)}>
									{chat.name}
									<span>#{(chat._id + '').padStart(4, '0')}</span>
								</li>
							) : null
						)}
						{globalchats.map((chat, index) =>
							isGroups() ? (
								<li
									key={chat._id}
									className={index === 0 ? styles.firstGlobal : ''}
									onClick={() => setChat(chat.dbid)}
								>
									{chat.name}
									<span>#{(chat._id + '').padStart(4, '0')}</span>
								</li>
							) : null
						)}
					</ul>
				</div>
				<div className={styles.addChat}>
					<button onClick={openChatModule}>
						{isPeople() ? 'Add Person' : 'Add Chat'} <FontAwesomeIcon icon={faPlus} />
					</button>
				</div>
			</div>
			<AddChatForm tab={tab} addChat={() => needChange.set(true)} />
			<ProfileSettings renameUser={renameUser} deleteUser={deleteUser} />
		</>
	);
};

export default SideMenu;
