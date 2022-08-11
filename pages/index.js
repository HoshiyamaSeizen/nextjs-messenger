import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import styles from '../styles/Home.module.sass';

const Home = () => {
	const router = useRouter();

	useEffect(() => {
		// router.push('/chat');
	}, [router]);

	return (
		<div className={styles.root}>
			<Head>
				<title>Messenger</title>
				<meta name="description" content="Messenger created with NextJS" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
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
					<SignupForm className={styles.signup} />
					<LoginForm className={styles.login} />
				</div>
			</main>
			<footer>
				<p>Created by Hoshiyama</p>
			</footer>
		</div>
	);
};

export default Home;
