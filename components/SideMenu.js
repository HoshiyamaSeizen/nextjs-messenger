import { deleteCookie } from 'cookies-next';
import {
	faGear,
	faArrowRightFromBracket,
	faMagnifyingGlass,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/SideMenu.module.sass';

const SideMenu = ({ user, redirect }) => {
	const logout = () => {
		deleteCookie('token');
		redirect();
	};

	const openChatModule = () =>
		document.getElementById('chat-add-module').setAttribute('opened', '');
	const openSettingsModule = () =>
		document.getElementById('settings-module').setAttribute('opened', '');

	return (
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
				<input type="text" name="search" placeholder="Search chat..." />
				<button>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</button>
			</div>
			<div className={styles.tabSelect}>
				<button className={styles.tabPeople}>People</button>
				<button className={styles.tabGroups}>Groups</button>
			</div>
			<div className={styles.chatListContainer}>
				<ul>
					{user.chats.map((chat) => (
						<li key={chat}>
							Chat 1<span>#{(chat + '').padStart(4, '0')}</span>
						</li>
					))}
				</ul>
			</div>
			<div className={styles.addChat}>
				<button onClick={openChatModule}>
					Add Chat <FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
		</div>
	);
};

export default SideMenu;
