import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { validate } from './api/auth/index';
import styles from '../styles/Home.module.sass';

import * as cookie from 'cookie';

const Home = () => {
	const router = useRouter();
	const redirect = () => router.push('/chat');

	return (
		<div className={styles.root}>
			<header>
				<h1>NextJS Messenger</h1>
			</header>
			<main>
				<p>
					Simple messenger built wtih NextJS (React), MongoDB (mongoose as ODM), Socket.IO and
					NodeJS. With this app you can chat with other people in the personal chats or the
					group chats.
				</p>
				<div className={styles.authorization}>
					<SignupForm className={styles.signup} redirect={redirect} />
					<LoginForm className={styles.login} redirect={redirect} />
				</div>
			</main>
			<footer>
				<p>Created by Hoshiyama</p>
			</footer>
		</div>
	);
};

export const getServerSideProps = async ({ req: { headers } }) => {
	const token = headers.cookie ? cookie.parse(headers.cookie)['token'] : null;
	if (await validate(token)) {
		return {
			redirect: {
				destination: '/chat',
				permanent: false,
			},
			props: {},
		};
	} else return { props: {} };
};

export default Home;
