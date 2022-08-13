import { useState } from 'react';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import login from '../actions/login';

const LoginForm = ({ className, redirect }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const loginUser = () => {
		setMessage('');
		login({ email, password })
			.then(() => redirect())
			.catch((err) => setMessage(err));
	};

	const handleChange = (e) => {
		switch (e.target.name) {
			case 'l-email':
				setEmail(e.target.value);
				break;
			case 'l-pas1':
				setPassword(e.target.value);
				break;
			default:
				break;
		}
	};

	return (
		<div className={className}>
			<h3>Log In</h3>
			{message ? <p error="">{message}</p> : null}
			<div>
				<label htmlFor="l-email">Email</label>
				<FontAwesomeIcon icon={faEnvelope} />
				<input
					type="email"
					name="l-email"
					id="l-email"
					placeholder="Enter the email"
					value={email}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label htmlFor="l-pas1">Password</label>
				<FontAwesomeIcon icon={faKey} />
				<input
					type="password"
					name="l-pas1"
					id="l-pas1"
					placeholder="Enter the password"
					value={password}
					onChange={handleChange}
				/>
			</div>
			<button onClick={loginUser}>Log In</button>
		</div>
	);
};

export default LoginForm;
