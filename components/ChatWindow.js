import { faUsers, faUser, faBars, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import InfoMenu from './InfoMenu';
import styles from '../styles/Chat.module.sass';
import loadChatAction from '../actions/loadChat';
import sendMessageAction from '../actions/sendMessage';
import addGroupAction from '../actions/addGroup';

const ChatWindow = ({ chatid, setChatID, updateList }) => {
	const [chat, setChat] = useState(null);
	const [message, setMessage] = useState('');
	const [, updateState] = useState();

	useEffect(() => {
		if (chatid)
			loadChatAction(chatid)
				.then((res) => setChat(res.chat))
				.catch((err) => console.log(err));
	}, [chatid]);

	const sendMessage = () => {
		if (message) {
			setMessage('');
			sendMessageAction(message, chatid)
				.then((message) => {
					chat.messages.push(message);
					updateState({});
				})
				.catch((err) => console.log(err));
		}
	};

	const enterChat = () => {
		addGroupAction(chatid)
			.then((chat) => {
				loadChatAction(chatid)
					.then((res) => setChat(res.chat))
					.catch((err) => console.log(err));
				updateList();
			})
			.catch((err) => console.log(err));
	};

	const pad = (num) => num.toString().padStart(2, '0');
	const formatTime = (ms) => {
		const date = new Date(ms);
		return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date
			.getFullYear()
			.toString()
			.slice(-2)} ${date.getHours()}:${pad(date.getMinutes())}`;
	};

	const openMenu = () => document.getElementById('info-container').setAttribute('opened', '');
	const handleMessageChange = (e) => setMessage(e.target.value);

	return (
		<>
			<div className={styles.container}>
				{chat ? (
					<>
						<div className={styles.title}>
							<FontAwesomeIcon icon={chat.personal ? faUser : faUsers} />{' '}
							<p>
								{chat.name}
								<span>#{(chat._id + '').padStart(4, '0')}</span>
							</p>
							<button onClick={openMenu}>
								<FontAwesomeIcon icon={faBars} />
							</button>
						</div>
						<div className={styles.messageListContainer}>
							{!chat.members.length && <p>You need to enter to see the messages</p>}
							{chat.members.length > 0 && !chat.messages.length && <p>No messages yet</p>}
							<ul>
								{chat.messages &&
									chat.messages.map((message) => (
										<li key={message._id}>
											<div className={message.own ? styles.my : ''}>
												<p className={styles.username}>{message.name}</p>
												<p>{message.text}</p>
												<p className={styles.date}>{formatTime(message.time)}</p>
											</div>
										</li>
									))}
							</ul>
						</div>
						{chat.members.length ? (
							<div className={styles.messageInput}>
								<textarea
									name="message"
									id="message"
									rows="1"
									placeholder="Enter the message..."
									value={message}
									onChange={handleMessageChange}
								></textarea>
								<button onClick={sendMessage}>
									<FontAwesomeIcon icon={faPaperPlane} />
								</button>
							</div>
						) : (
							<button className={styles.enterButton} onClick={enterChat}>
								Enter the chat
							</button>
						)}
						<InfoMenu
							chat={chat}
							cid={chatid}
							clearChat={() => {
								setChat(null);
								setChatID(null);
							}}
							updateList={updateList}
						/>
					</>
				) : null}
			</div>
		</>
	);
};

export default ChatWindow;
