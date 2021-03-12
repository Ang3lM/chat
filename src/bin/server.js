const app = require('../app.js');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('../utils/messages.js');

app.set('port', process.env.PORT || 3000);

console.log(app.get('port'));

const server = http.createServer(app);

const io = socketio(server);

const botName = 'ChatCord Bot';

io.on('connection', socket =>{
	console.log("Nw WS Connection...");

	// Run when clients connects
	socket.on('joinRoom', ({username, room})=>{
		//Welcomen current user
		socket.emit('message', formatMessage(botName, 'Welcome to ChartCord'));

		//broadcats when s user connects
		socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));
	});


	// Listen for chat9 -Message
	socket.on('chatMessage', msg => {
		io.emit('message', formatMessage('USER',msg));
	})

	//Runs when client disconnects
	socket.on('disconnect', ()=>{
		io.emit('message', 'A user has left the chat');
	});
});

server.listen(app.get('port'), () => console.log(`Server running on http://localhost:${app.get('port')}`));