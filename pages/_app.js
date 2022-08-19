import Meta from '../components/Meta';
import '../styles/globals.sass';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Meta />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
