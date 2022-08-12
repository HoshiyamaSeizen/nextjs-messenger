import mongoose from 'mongoose';

const infoSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	added: {
		type: Number,
		default: 0,
	},
	deleted: {
		type: Number,
		default: 0,
	},
});

const Info = mongoose.models.info || mongoose.model('info', infoSchema, 'info');
export default Info;
