import {
	faUsers,
	faUser,
	faBars,
	faPaperPlane,
	faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import InfoMenu from './InfoMenu';
import styles from '../styles/Chat.module.sass';
import loadChatAction from '../actions/loadChat';
import sendMessageAction from '../actions/sendMessage';
import addGroupAction from '../actions/addGroup';

const ChatWindow = ({ chatid, userid, setChatID, updateList, newMessage, socket }) => {
	const [chat, setChat] = useState(null);
	const [message, setMessage] = useState('');
	const lastElement = useRef(null);

	// Load chat info and connect to the chat when Chat ID is changed
	// 		and scroll to bottom (if the scrollbar was at the bottom before that)
	useEffect(() => {
		if (chatid && socket)
			loadChatAction(chatid)
				.then((res) => {
					setChat(res.chat);
					if (res.chat.members.length > 0) socket.emit('joinChat', res.chat.dbid);
					setTimeout(() => {
						if (lastElement.current) lastElement.current.scrollIntoView();
					}, 10);
				})
				.catch((err) => console.log(err));
	}, [chatid, socket]);

	// Display message in window and scroll to bottom (if the scrollbar was at the bottom before that)
	useEffect(() => {
		if (newMessage.value && chat) {
			const msg = newMessage.value;
			msg.own = +msg.user === userid;
			chat.messages.push(msg);
			newMessage.clear();

			if (lastElement.current) {
				const container = lastElement.current.parentElement.parentElement;
				if (
					Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 10
				)
					setTimeout(() => {
						lastElement.current.scrollIntoView();
					}, 10);
			}
		}
	}, [newMessage, chat, userid]);

	// Send message
	const sendMessage = () => {
		if (message) {
			setMessage('');
			sendMessageAction(message, chatid)
				.then((message) => {
					message.chatid = chatid;
					socket.emit('chatMessage', message);
				})
				.catch((err) => console.log(err));
		}
	};

	// Load chat info and connect to the chat (when button pressed)
	const enterChat = () => {
		addGroupAction(chatid)
			.then((chat) => {
				loadChatAction(chatid)
					.then((res) => {
						setChat(res.chat);
						if (res.chat.members.length > 0) socket.emit('joinChat', res.chat.dbid);
					})
					.catch((err) => console.log(err));
				updateList();
			})
			.catch((err) => console.log(err));
	};

	// [Mobile] Return to menu
	const exitToMenu = () => {
		document.getElementById('menu-container').setAttribute('opened', '');
		document.getElementById('chat-container').removeAttribute('opened');
	};

	// Date formatting
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
			<div id="chat-container" className={styles.container}>
				{chat ? (
					<>
						<div className={styles.title}>
							<button
								className={styles.mobileReturnBtn}
								onClick={exitToMenu}
								aria-label="Return to chat menu"
							>
								<FontAwesomeIcon icon={faArrowLeft} />
							</button>
							<FontAwesomeIcon icon={chat.personal ? faUser : faUsers} />{' '}
							<p>
								{chat.name}
								<span>#{(chat._id + '').padStart(4, '0')}</span>
							</p>
							<button onClick={openMenu} aria-label="Open info menu">
								<FontAwesomeIcon icon={faBars} />
							</button>
						</div>
						<div className={styles.messageListContainer}>
							{!chat.members.length && <p>You need to enter to see the messages</p>}
							{chat.members.length > 0 && !chat.messages.length && <p>No messages yet</p>}
							<ul>
								{chat.messages &&
									chat.messages.map((message) => (
										<li ref={lastElement} key={message._id}>
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
								<button onClick={sendMessage} aria-label="Send">
									<FontAwesomeIcon icon={faPaperPlane} />
								</button>
							</div>
						) : (
							<button
								className={styles.enterButton}
								onClick={enterChat}
								aria-label="Enter the chat"
							>
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
