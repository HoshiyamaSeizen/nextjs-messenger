import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginForm = ({ className }) => {
	return (
		<div className={className}>
			<h3>Log In</h3>
			<p error=""> An error occured</p>
			<div>
				<label htmlFor="l-email">Email</label>
				<FontAwesomeIcon icon={faEnvelope} />
				<input type="email" name="l-email" id="l-email" placeholder="Enter the email" />
			</div>
			<div>
				<label htmlFor="l-pas1">Password</label>
				<FontAwesomeIcon icon={faKey} />
				<input type="password" name="l-pas1" id="l-pas1" placeholder="Enter the password" />
			</div>
			<button>Log In</button>
		</div>
	);
};

export default LoginForm;
