import mongoose from 'mongoose';

if (!process.env.MONGODB_URL)
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');

let cached = global.mongoose || (global.mongoose = { connection: null, promise: null });

const dbConnect = async () => {
	if (cached.connection) return cached.connection;

	if (!cached.promise) {
		cached.promise = mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
		});
	}

	cached.connection = await cached.promise;
	return cached.connection;
};

export default dbConnect;
