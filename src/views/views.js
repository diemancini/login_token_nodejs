var fs = require('fs');
var __dir = '/Users/diego/Documents/Programacao/NodeJs/sign_up_in_jwt/src/views/';

module.exports = {

	login: function(req, res) {
		fs.readFile(__dir +'login.html', function(err, data) {
	        res.end(data);
	    });
	},

	lista_desejo: function(req, res, result) {
		fs.readFile(__dir +'lista-desejo.html', function(err, data) {
	        res.end(data);
	    });
	},

	register: function(req, res) {
		fs.readFile(__dir +'register.html', function(err, data) {
	        res.end(data);
	    });
	}
}