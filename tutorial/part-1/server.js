var
express		= require('express'),
app			= express(),
http		= require('http').Server(app);

/* Send response to client */
app.get('/', function(req, res) {
	res.send('wow! such server! very listening!');
});

/* Start listening on port 4040 */
http.listen(4040, function(){
	console.log('Chat server listening on *:4040');
});