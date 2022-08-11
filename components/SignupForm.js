import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignupForm = ({ className }) => {
	return (
		<div className={className}>
			<h3>Sign Up</h3>
			<div>
				<label htmlFor="r-name">Name</label>
				<FontAwesomeIcon icon={faUser} />
				<input type="text" name="r-name" id="r-name" placeholder="Enter the name" />
			</div>
			<div>
				<label htmlFor="r-email">Email</label>
				<FontAwesomeIcon icon={faEnvelope} />
				<input type="email" name="r-email" id="r-email" placeholder="Enter the email" />
			</div>
			<div>
				<label htmlFor="r-pas1">Password</label>
				<FontAwesomeIcon icon={faKey} />
				<input type="password" name="r-pas1" id="r-pas1" placeholder="Enter the password" />
			</div>
			<div>
				<label htmlFor="r-pas2">Confirm Password</label>
				<FontAwesomeIcon icon={faKey} />
				<input type="password" name="r-pas2" id="r-pas2" placeholder="Confirm the password" />
			</div>
			<button>Sign Up</button>
		</div>
	);
};

export default SignupForm;
