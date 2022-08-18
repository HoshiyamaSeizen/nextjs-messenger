import { Server } from 'socket.io';

const rooms = new Set();

const handler = (req, res) => {
	if (!res.socket.server.io) {
		console.log('Socket is initializing');
		const io = new Server(res.socket.server);
		res.socket.server.io = io;

		io.on('connection', (socket) => {
			socket.on('chatMessage', (message) => {
				io.to(message.chatid).emit('message', message);
			});

			socket.on('joinChat', (chatid) => {
				for (const id of rooms) socket.leave(id);
				rooms.add(chatid);
				socket.join(chatid);
			});
		});
	}
	res.end();
};

export default handler;
