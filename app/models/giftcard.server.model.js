'use strict';
// I want to change gift card to CliqueCard, will do that later though.
// What if the giftcards, held an array of the transactions? The giftcard it's self had more that i kept track of?
//
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
   // mailgunService = require('../services/mailgun-service'),
   userService = require('../services/user-service'),
   // twilioService = require('../services/twilio-service'),
   nodemailer = require('nodemailer'),
   config = require('../../config/config'),
   client = require('twilio')('AC9bfd970cef5934b23e69f1ef72812a23', 'a6bfeeed497cfb9b8d10c329ce721759'),
   smtpTransport = nodemailer.createTransport(config.mailer.options),
   //  twilioService = require('../services/twilio/outgoingTwilioText.service'),
   Schema = mongoose.Schema;
/**
 * Giftcard Schema,
 * Included are the validations for the mongoose model.
 */
var GiftcardSchema = new Schema({
   amount: {
      type: Number,
      min: 0,
      max: 50000, //equates to $500.00, 100 = $1.00, 50 = $.50
      // need to make the number validate a number not less than zero.
      required: 'Please enter an amount to purchase between 0 and 500000'
   }, // need to make sure it's always a number and never zero or a negative number.
   // for initial purchase.
   stripeOrderId: {
      type: String,
      match: [/ch_[\w\d._%+-]+/, 'This value entered for the stripeId does not match ({VALUE})'],
      //TODO: write regular expresion to match "ch_"[0-2](spaces) for the stripe id.
      required: 'Please provide the stripeOrderId in the correct format.'
   }, // I should only get one stripeOrderId once
   /**
    *  Message, the message that the user wishes for another user to see.
    *  a message doesn't need to have a string attached to it.
    */
   occasion: {
      type: String,
      default: 'A gift for you!'
   },
   //TODO: probably going to need to store the a refernce to the image the user is sending back.
   created: {
      type: Date,
      default: Date.now
   },
   // subledger transaction id's
   // This is the intial transaction id, but we will also contain a array of subledger transactions.
   // intitalSubledgerTransactionId:{
   //    type:String,
   //    required: 'Please provide the subledger transaction Id associated with the intial purchase of this giftcard.'
   // },
   // subledgerLogsIds: [{
   //    logId:{
   //       type:String,
   //       // TODO: create a regular expression for what the subledger id's look like.
   //    },
   //    dateCreated:{
   //       type: Date,
   //       default: Date.now
   //    },
   // }],
   purchaserOfGiftCard: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id who is sending the giftcard.'
   },
   spenderOfGiftCard: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id to send this giftcard too.'
   }
});
/**
 * Hook a pre save method to verify that the spenderofgiftcard and purchaserofgiftcard are not the
 * same user. could elborate later, and do a deep search to make sure these two
 * people are completely different and un related if we wanted too
 */
GiftcardSchema.post('save', function() {

   var emailHolder = userService.getUserEmail(this.purchaserOfGiftCard);
   this.fireOffRecipet(emailHolder);
   var phoneNumberHolder = userService.getUserPhoneNumber(this.spenderOfGiftCard);

   // done();

});
//TODO: need to create method that accepts email, and fire off reciept email.
//
GiftcardSchema.methods.fireOffRecipet = function(anEmail) {
   //TODO: implement fire off to email.
   //NOTE: need to create a html template for the email.
   var mailOptions = {
      to:anEmail,
      from: config.MAILE_FROM,
      subject: 'Your Recent Gift-Card Purchase!',
      text: '\n\n' + 'You Recently purchased a giftcard' + this.amount + 'something'+'not sure what the email should say in its entiriety'
   };
//NOTE: if we use a template and I have to load variables, I will have to get more informaiton from the user.
// this works on a basic level though.
   return smtpTransport.sendMail(mailOptions, function(error, info){
      if(error){
         console.log(error);
         //NOTE: note sure what to do about error handling in this area.
      }else{
         console.log('Email Reciept sent: '+info.response);
      }
   });
};
//TODO: need to create a method that accepts phoen number, and fires off phone number.
GiftcardSchema.methods.sendTextToFriend = function(friendNumber) {
   //TODO: implement method that fire off text.
   return client.messages.create({
      body: 'You have a new giftcard in your account!',// put link in to log user in and view list of cards. 
      to: friendNumber,
      from: '+15624454688',
   }, function(err, message) {
      if (err) {
         console.log(err);
      }
      if (message) {
         console.log(message.sid);
      }
   });
};


mongoose.model('Giftcard', GiftcardSchema);
