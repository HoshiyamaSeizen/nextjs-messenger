import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/InfoMenu.module.sass';
import exitChatAction from '../actions/exitChat';
import deleteChatAction from '../actions/deleteChat';

const InfoMenu = ({ chat, cid, clearChat, updateList }) => {
	const creationDate = new Date(chat.creationDate);

	const exit = () => {
		if (chat.isCreator || chat.personal)
			deleteChatAction(cid)
				.then(() => {
					clearChat();
					closeMenu();
					updateList();
				})
				.catch((err) => console.log(err));
		else
			exitChatAction(cid)
				.then(() => {
					clearChat();
					closeMenu();
					updateList();
				})
				.catch((err) => console.log(err));
	};

	const closeMenu = () => {
		document.getElementById('info-container').removeAttribute('opened');
	};

	return (
		<div id="info-container" className={styles.container}>
			<button className={styles.close} onClick={closeMenu}>
				<FontAwesomeIcon icon={faXmark} />
			</button>
			<h2>Info</h2>
			<p className={styles.creationDate}>Creation date: {creationDate.toLocaleString()}</p>
			<p className={styles.owner}>Creator: #{(chat.creator + '').padStart(4, '0')}</p>
			<h4>Chat members</h4>
			<div className={styles.memberListContainer}>
				<ul>
					{chat.members.map((member) => (
						<li key={member.id}>
							{member.name} <span>#{(member.id + '').padStart(4, '0')}</span>
						</li>
					))}
				</ul>
			</div>
			<button className={styles.exitGroupBtn} onClick={exit}>
				{chat.isCreator || chat.personal ? 'Delete the chat' : 'Exit group chat'}
			</button>
		</div>
	);
};

export default InfoMenu;
