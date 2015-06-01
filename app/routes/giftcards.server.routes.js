'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/api/users.server.controller');
	var giftcards = require('../../app/controllers/api/giftcards.server.controller');

	app.route('/api/spendAGiftcard')
	.post(giftcards.spendAGiftcard);
	// Giftcards Routes
	app.route('/api/giftcards')
		.get(users.requiresLogin, giftcards.list)//
		.post(giftcards.create);

	app.route('/api/giftcards/:giftcardId')
		.get(users.requiresLogin, giftcards.hasAuthorization, giftcards.read)
		.put(users.requiresLogin, giftcards.hasAuthorization, giftcards.update)
		//TODO: when you are working on the update method, make sure the program doesn't
		// send emails each time the value is updated.
		.delete(users.requiresLogin, giftcards.hasAuthorization, giftcards.delete);
		//.post(users.requireLogin, giftcards.hasAuthorization, giftcards.send);// to send a giftcard we need two things.
		// a username(later a phone number) and a giftcard to send.
   	// Finish by binding the Giftcard middleware
	app.param('giftcardId', giftcards.giftcardByID);
	//app.param('giftcardUserName', giftcards.giftcardByUserName);
};
