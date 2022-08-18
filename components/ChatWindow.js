import { faUsers, faUser, faBars, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
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

	useEffect(() => {
		if (chatid && socket)
			loadChatAction(chatid)
				.then((res) => {
					setChat(res.chat);
					if (res.chat.members.length > 0) socket.emit('joinChat', res.chat._id);
					setTimeout(() => {
						if (lastElement.current) lastElement.current.scrollIntoView();
					}, 10);
				})
				.catch((err) => console.log(err));
	}, [chatid, socket]);

	useEffect(() => {
		if (newMessage.value && chat) {
			const msg = newMessage.value;
			msg.own = +msg.user === userid;
			chat.messages.push(msg);
			newMessage.clear();

			const container = lastElement.current.parentElement.parentElement;
			if (Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 10)
				setTimeout(() => {
					if (lastElement.current) lastElement.current.scrollIntoView();
				}, 10);
		}
	}, [newMessage, chat, userid]);

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

	const enterChat = () => {
		addGroupAction(chatid)
			.then((chat) => {
				loadChatAction(chatid)
					.then((res) => {
						setChat(res.chat);
						if (res.chat.members.length > 0) socket.emit('joinChat', res.chat._id);
					})
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
