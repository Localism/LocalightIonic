'use strict';
// I want to change gift card to CliqueCard, will do that later though.
// What if the giftcards, held an array of the transactions? The giftcard it's self had more that i kept track of?
//
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
   //  twilioService = require('../services/twilio/outgoingTwilioText.service'),
   Schema = mongoose.Schema;

/**
 * Giftcard Schema,
 * Included are the validations for the mongoose model.
 */
var GiftcardSchema = new Schema({
   /**
    * Amount, the value of which the card holds, to be spent at a merchant's busienss.
    * A postive integery in teh smallest currency unit(e.g 100 cents to charge $1.00)
    * @type {Object}
    */
   amount: {
      type: Number,
      min: 0,
      max: 50000,//equates to $500.00, 100 = $1.00, 50 = $.50
      // need to make the number validate a number not less than zero.
      required: 'Please enter an amount to purchase between 0 and 500000'
   }, // need to make sure it's always a number and never zero or a negative number.
   /**
    * [stripeOrderId Provided when the giftcard is first purchased, and used when or if we need to refund the giftcard.]
    * @type {String}
    */
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
   // subledgerLogsIds:[{
   //    logId:{
   //       type:String,
   //
   //    }
   // }],
   /**
    * This is the user who will be purchasing the gitcard for another user.
    * When this user purchases the giftcard they will be charged and sent a reciepit on
    * successfull save of the object.
    * @type {Object}
    */
   purchaserofgiftcard: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id who is sending the giftcard.'
   },
   /**
    * This user will be the one receiving the giftcard and will be sent a text message when
    * they receive the giftard.
    * @type {Object}
    */
   spenderofgiftcard: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id to send this giftcard too.'
   }
});

//TODO: I can make chainable pre-save methods, all I have to do is use next. This way I can check that
// the users are not the same.
// TODO: in the post method email the to different users.
// TODO: also figure out how to do the cron job, for different times to send
/**
 * Hook a pre save method to verify that the spenderofgiftcard and purchaserofgiftcard are not the
 * same user. could elborate later, and do a deep search to make sure these two
 * people are completely different and un related if we wanted too
 */
//  GiftcardSchema.pre('save', function(next) {
//     // Make sure that the to and from users are different people and not the
//     // same. If they are the same stop, and throw an error.
//     // I don't think I can make this a validation thing, I think this needs to
//     // done before the giftcard reachees the save point. like the first line of defense.
//     // In theory, I could do the stripe transaction stuff here too.
//
// });

GiftcardSchema.post('save', function(next){
   // If everything worked out send an email to the purchaserofgiftcard with a reciepet, a
   // and send a text message to the to user.
   // when the giftcard is saved, based on the save the users will be able to
   // the giftcard appear in there account.
   // call mailgun service
   // call twilio sevice
   
});


// GiftcardSchema.pre('save', function(next) {
//
//   var smtpTransport = nodemailer.createTransport(config.mailer.options);
//   var mailOptions = {
//     to: this.emailForReceipt,
//     from: 'gift-confirm@clique.cc',
//     subject: 'Your Clique Card has been sent!',
//     text: '\n\n'+ this.purchaserofgiftcard.dipslayName +', your gift of $'+ this.amount + 'is on it&#39;s way to'+'! With the CLIQUE Local Gift Card you can apply your gift toward purchases at numerous locally-owned merchants in the Long Beach area'
//   };
//   smtpTransport.sendMail(mailOptions, function(error) {
//     if (!error) {
//       console.log(mailOptions);
//       // this.send({
//       //   message: 'An email has been sent to ' + this.purchaserofgiftcard.email + ' with further instructions.'
//       // });
//       //TODO: need to find out if there is a way to send a response from the model
//     } else {
//       console.log('got an error: ', error);
//     }
//   });
//   next();
// });
/**
 * Hook a post save method to send out emails and texts
 */
//  GiftcardSchema.post('save', function(next) {
//     twilioService.sendConfirmationText(this.spenderofgiftcard);
//    //  mailgunService.sendReceiptEmail(this.purchaserofgiftcard);
// 	next();
// });

mongoose.model('Giftcard', GiftcardSchema);
