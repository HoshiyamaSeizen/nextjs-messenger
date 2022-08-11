import Module from './Module';
import styles from '../styles/AddChatForm.module.sass';

const AddChatForm = () => {
	return (
		<Module id="chat-add-module" width={420} height={200}>
			<p error="">An error occured</p>
			<input
				className={styles.input}
				type="text"
				name="chatname"
				placeholder="Enter the chat name"
			/>
			<button className={styles.addExisting}>Add existing chat </button>
			<button className={styles.addNew}>Add new chat</button>
		</Module>
	);
};

export default AddChatForm;
