import Module from './Module';
import styles from '../styles/ProfileSettings.module.sass';

const ProfileSettings = () => {
	return (
		<Module id="settings-module" width={420} height={200}>
			<p error="">An error occured</p>
			<input className={styles.input} type="text" name="name" placeholder="Enter the name" />
			<button className={styles.rename}>Rename account</button>
			<button className={styles.delete}>Delete account</button>
		</Module>
	);
};

export default ProfileSettings;
