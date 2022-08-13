import Module from './Module';
import styles from '../styles/ProfileSettings.module.sass';
import { useState } from 'react';

const ProfileSettings = ({ renameUser, deleteUser }) => {
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');

	const _rename = () => {
		if (!name) return setMessage("Name shouldn't be empty");
		renameUser(name);
		close();
	};

	const _delete = () => {
		deleteUser();
		close();
	};

	const handleNameChange = (e) => setName(e.target.value);
	const close = () => document.getElementById('settings-module').removeAttribute('opened');

	return (
		<Module id="settings-module" width={420} height={200}>
			{message ? <p error="">{message}</p> : null}
			<input
				className={styles.input}
				type="text"
				name="name"
				placeholder="Enter the name"
				value={name}
				onChange={handleNameChange}
			/>
			<button className={styles.rename} onClick={_rename}>
				Rename account
			</button>
			<button className={styles.delete} onClick={_delete}>
				Delete account
			</button>
		</Module>
	);
};

export default ProfileSettings;
