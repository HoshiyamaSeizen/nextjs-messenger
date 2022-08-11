import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../styles/InfoMenu.module.sass';

const InfoMenu = () => {
	const closeMenu = () => {
		document.getElementById('info-container').removeAttribute('opened');
	};

	return (
		<div id="info-container" className={styles.container}>
			<button className={styles.close} onClick={closeMenu}>
				<FontAwesomeIcon icon={faXmark} />
			</button>
			<h2>Info</h2>
			<p className={styles.creationDate}>Creation date: xx.xx.xxxx xx:xx</p>
			<h4>Chat members</h4>
			<div className={styles.memberListContainer}>
				<ul>
					<li>Person 1</li>
					<li>Person 39</li>
				</ul>
			</div>
			<button className={styles.exitGroupBtn}>Exit group chat</button>
		</div>
	);
};

export default InfoMenu;
