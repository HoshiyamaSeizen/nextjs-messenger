import { faUsers, faUser, faBars, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Chat.module.sass';

const Chat = () => {
	const openMenu = () => document.getElementById('info-container').setAttribute('opened', '');

	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<FontAwesomeIcon icon={faUsers} />{' '}
				<p>
					Chat 6<span>#7647467</span>
				</p>
				<button onClick={openMenu}>
					<FontAwesomeIcon icon={faBars} />
				</button>
			</div>
			<div className={styles.messageListContainer}>
				<ul>
					<li>
						<div>
							<p className={styles.username}>User 1</p>
							<p>Message 893871739</p>
							<p className={styles.date}>date: 19</p>
						</div>
					</li>
					<li>
						<div className={styles.my}>
							<p className={styles.username}>hoshiyama</p>
							<p>Message 1280000000</p>
							<p className={styles.date}>date: 20</p>
						</div>
					</li>
					<li>
						<div>
							<p className={styles.username}>User 12</p>
							<p>Message 893871739893871739</p>
							<p className={styles.date}>date: 21</p>
						</div>
					</li>
				</ul>
			</div>
			<div className={styles.messageInput}>
				<textarea
					name="message"
					id="message"
					rows="1"
					placeholder="Enter the message..."
				></textarea>
				<button>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</div>
		</div>
	);
};

export default Chat;
