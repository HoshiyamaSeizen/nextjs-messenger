import Head from 'next/head';

const Meta = ({ title, keywords, description }) => {
	return (
		<Head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="keywords" content={keywords} />
			<meta name="description" content={description} />
			<title>{title}</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
};

Meta.defaultProps = {
	title: 'Messenger',
	keywords: 'nextjs, socketio, mongoose, nodejs, sass, web, programming, messenger',
	description: 'Messenger creted with NextJS',
};

export default Meta;
