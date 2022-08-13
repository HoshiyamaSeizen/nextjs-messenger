import Module from './Module';
import styles from '../styles/AddChatForm.module.sass';
import { useState } from 'react';

const AddChatForm = ({ tab }) => {
	const [text, setText] = useState('');
	const [type, setType] = useState('existing');
	const [message, setMessage] = useState('');

	const isPeople = () => tab === 'people';
	const isGroups = () => tab === 'groups';
	const isExisting = () => type === 'existing';
	const isNew = () => type === 'new';

	const submit = () => {
		setMessage('');
		if (!text) setMessage("Field sholdn't be empty");
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	return (
		<Module id="chat-add-module" width={420} height={isGroups() ? 185 : 155}>
			{message ? <p error="">{message}</p> : null}
			{isGroups() ? (
				<div className={styles.tabSelect}>
					<button
						className={styles.tabPeople}
						chosen={isExisting().toString()}
						onClick={() => setType('existing')}
					>
						Existing
					</button>
					<button
						className={styles.tabGroups}
						chosen={isNew().toString()}
						onClick={() => setType('new')}
					>
						New
					</button>
				</div>
			) : null}
			<input
				className={styles.input}
				type="text"
				name="text"
				placeholder={
					isPeople()
						? 'Enter the id...'
						: isNew()
						? 'Enter the chat name'
						: 'Enter the chat id'
				}
				value={text}
				onChange={handleTextChange}
			/>
			<button className={styles.add} onClick={submit}>
				{isPeople() ? 'Add the person' : isNew() ? 'Create new chat' : 'Add existing chat'}
			</button>
		</Module>
	);
};

export default AddChatForm;
