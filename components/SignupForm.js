import { useState } from 'react';
import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import register from '../actions/register';

const SignupForm = ({ className, redirect }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [password1, setPassword1] = useState('');
	const [message, setMessage] = useState('');

	const registerUser = () => {
		setMessage('');
		register({ name, email, password, password1 })
			.then(() => redirect())
			.catch((err) => setMessage(err));
	};

	const handleChange = (e) => {
		switch (e.target.name) {
			case 'r-name':
				setName(e.target.value);
				break;
			case 'r-email':
				setEmail(e.target.value);
				break;
			case 'r-pas1':
				setPassword(e.target.value);
				break;
			case 'r-pas2':
				setPassword1(e.target.value);
				break;
			default:
				break;
		}
	};

	return (
		<div className={className}>
			<h3>Sign Up</h3>
			{message ? <p error="">{message}</p> : null}
			<div>
				<label htmlFor="r-name">Name</label>
				<FontAwesomeIcon icon={faUser} />
				<input
					type="text"
					name="r-name"
					id="r-name"
					placeholder="Enter the name"
					value={name}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label htmlFor="r-email">Email</label>
				<FontAwesomeIcon icon={faEnvelope} />
				<input
					type="email"
					name="r-email"
					id="r-email"
					placeholder="Enter the email"
					value={email}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label htmlFor="r-pas1">Password</label>
				<FontAwesomeIcon icon={faKey} />
				<input
					type="password"
					name="r-pas1"
					id="r-pas1"
					placeholder="Enter the password"
					value={password}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label htmlFor="r-pas2">Confirm Password</label>
				<FontAwesomeIcon icon={faKey} />
				<input
					type="password"
					name="r-pas2"
					id="r-pas2"
					placeholder="Confirm the password"
					value={password1}
					onChange={handleChange}
				/>
			</div>
			<button onClick={registerUser}>Sign Up</button>
		</div>
	);
};

export default SignupForm;
