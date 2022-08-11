import {
	faGear,
	faArrowRightFromBracket,
	faMagnifyingGlass,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/SideMenu.module.sass';

const SideMenu = () => {
	const openChatModule = () =>
		document.getElementById('chat-add-module').setAttribute('opened', '');

	const openSettingsModule = () =>
		document.getElementById('settings-module').setAttribute('opened', '');

	return (
		<div className={styles.container}>
			<div className={styles.profile}>
				<p>
					Hoshiyama Seizen<span>#83983</span>
				</p>
				<button onClick={openSettingsModule}>
					<FontAwesomeIcon icon={faGear} />
				</button>
				<button>
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
					<li>
						Chat 1<span>#83983</span>
					</li>
					<li>
						Chat 2<span>#83983</span>
					</li>
					<li>
						Chat 3<span>#83983</span>
					</li>
					<li>
						Chat 4<span>#83983</span>
					</li>
					<li>
						Chat 5<span>#83983</span>
					</li>
					<li>
						Chat 6<span>#83983</span>
					</li>
					<li>
						Chat 7<span>#83983</span>
					</li>
					<li>
						Chat 8<span>#83983</span>
					</li>
					<li>
						Chat 9<span>#83983</span>
					</li>
					<li>
						Chat 10<span>#83983</span>
					</li>
					<li>
						Chat 11<span>#83983</span>
					</li>
					<li>
						Chat 12<span>#83983</span>
					</li>
					<li>
						Chat 13<span>#83983</span>
					</li>
					<li>
						Chat 14<span>#83983</span>
					</li>
					<li>
						Chat 15<span>#83983</span>
					</li>
					<li>
						Chat 16<span>#83983</span>
					</li>
					<li>
						Chat 17<span>#83983</span>
					</li>
					<li>
						Chat 18<span>#83983</span>
					</li>
					<li>
						Chat 19<span>#83983</span>
					</li>
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
