const app = require('../app.js');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('../utils/messages.js');
const {userJoin, getCurretUser, userLeavel, getRoomUsers} = require('../utils/users.js');

app.set('port', process.env.PORT || 3000);

console.log(app.get('port'));

const server = http.createServer(app);

const io = socketio(server);

const botName = 'ChatCord Bot';

io.on('connection', socket =>{

	// Run when clients connects
	socket.on('joinRoom', ({username, room})=>{
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);
		//Welcomen current user
		socket.emit('message', formatMessage(botName, 'Welcome to ChartCord'));

		//broadcats when s user connects
		socket.broadcast
			.to(user.room)
			.emit('message', formatMessage(botName, `${user.username} has joined the chat`));

		// send users and room info
		io.to(user.room).emit('roomUsers',{
			room: user.room,
			users: getRoomUsers(user.room)
		});


	});


	// Listen for chat9 -Message
	socket.on('chatMessage', msg => {
		const user = getCurretUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username,msg));
	})

	//Runs when client disconnects
	socket.on('disconnect', ()=>{
		const user = userLeavel(socket.id);

		if(user){
			io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));

			// send users and room info
			io.to(user.room).emit('roomUsers',{
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});

server.listen(app.get('port'), () => console.log(`Server running on http://localhost:${app.get('port')}`));