const express = require('express');
const app = express();

app.get('/', (req, res)=>{
	console.log("Ruta principal");
	res.send("Hola mundoooooooooooooo");
});


module.exports = app;