var chat;
$(function () {

	/* Define a new 'class' named Chat */
	function Chat() {
		var self = this;
		this.$text = $('#chat-text');
		console.log('Chat client constructor called');
	}

	/* Connectes to a server */
	Chat.prototype.connect = function() {
		var self = this;
		this.io = io();

		/* Add an event listener for the 'connect' event */
		this.io.on('connect', function() {
			self.$text.html('');
			/* Indication for the client */
			self.writeLine('<span class="text-success">Connected to server</span>');
		});
	};

	/* Writes a line to our client interface */
	Chat.prototype.writeLine = function(html) {
		this.$text.append('<div>' + html + '</div>');
		/* Auto-Scroll to the bottom */
		this.$text.animate({ scrollTop: chat.$text.prop('scrollHeight') }, "slow");
	};

	/* Instantiate a Chat object */
	chat = new Chat();
	/* Attempt to connect to the server */
	chat.connect();
});