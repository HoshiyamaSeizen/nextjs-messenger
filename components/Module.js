import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/Module.module.sass';

const Module = ({ id, width, height, children }) => {
	const closeModule = () => document.getElementById(id).removeAttribute('opened');

	return (
		<div id={id} className={styles.module}>
			<div className={styles.container} style={{ width: width + 'px', height: height + 'px' }}>
				<button className={styles.close} onClick={closeModule} aria-label="Close">
					<FontAwesomeIcon icon={faXmark} />
				</button>
				{children}
			</div>
		</div>
	);
};

export default Module;
