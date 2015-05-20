'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
   errorHandler = require('./errors.server.controller'),
   config = require('../../config/config'),
   Giftcard = mongoose.model('Giftcard'),
   User = mongoose.model('User'),
   _ = require('lodash'),
   stripe = require('stripe')(config.clientID, config.clientSecret),
   message = null,
   Q = require('q');

/**
 * This should create a giftcard, and also send out signals to the other services. The goal is to buy the end of this method have a giftcard created.
 * This will involved stripe, and subledger.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.create = function(req, res) {
   // if a user isn't found create one, otherwise find the user and save the giftcard.
   var giftcard = new Giftcard(req.body);
   // by the time the giftcard reaches this point it
   // should have all the information it needs in the
   // the giftcard body.
   // the toUser id, occasionMessage, Amount,
   // stripeOrderid, etc.
   // This Controller merily creates the giftcard.
   giftcard.fromUser = req.user;

   giftcard.save(function(err) {
      if (err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.json(giftcard);
      }
   });
};
// assign the toUser before when you get it from the other method.
// check to make sure user has a stripe credit card token and customer token.

/**
 * Show the current Giftcard
 */
exports.read = function(req, res) {
   res.jsonp(req.giftcard);
};
// Don't write new code, use the update and find methods to change ownder ship of the giftcard.
// the update and find methods work find.
/**
 * SpendAGiftcard will subtract an amount from the giftcard.
 *
 * @param {[type]} req [description]
 * @param {[type]} res [description]
 */
exports.spendAGiftcard = function(req, res) {
   console.log('this is the value of the req.body'+ JSON.stringify(req.body));
   var holderValue = req.body.value;
   // find the giftcard in the req.
   var giftcard = req.giftcard;
   // extend the ability to update the giftcard.
   giftcard = _.extend(giftcard, req.body);
   // I need two things, a value and another UserID(merchant)
   // Spend a giftcard. similar to update only it checks the amount and does other things.
   // Make the call the subledger before saving the value.
   // First validation is to make sure the giftcard does not go negative.
   //
   if(holderValue === null || holderValue > giftcard.amount ){
      return res.status(400).send({
         message:'Please Enter a value to subtract less than or equal to the exact amount of the giftcard.'
      });
   } else{
      // subtract the value from the giftcard. and update the giftcard.

      // payout other user, and take out localism cut.

      // make call to subledger to reflect purchase.

      // second to last thing to happen
      giftcard.amount = giftcard.amount - holderValue;// check with zlatko on this one.
      // if the giftcard goes to zero, change the flag on the giftcard before it's updated.
      // that way in the future it can't be used again.
      //

      // last step in the controller.
      giftcard.save(function(err) {
         if (err) {
            return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
            });
         } else {
            res.jsonp(giftcard);
         }
      });
   }
};
/**
 * Update a Giftcard
 */
exports.update = function(req, res) {
   // should only decrement the amount of a giftcard.
   // first check the value coming in against the value of the giftcard. if to greater than the size of the giftcard send back an error.
   // first check to see if this giftcard is zeroed out.
   // other wise, change the value of the card, and update subledger.
   // if the card zero's out then change the zeroedOutFlag in the model to true.
   // that way this giftcard can't get used.
   //
   // I know what merchant you are using the giftcard at so I just want to pay you out,
   // or pay you out minus what we keep.
   //
   var giftcard = req.giftcard;

   giftcard = _.extend(giftcard, req.body);
   // might not need to create a transaction object, instead, since we are just updating the value of the object.
   //
   // every time the giftcard is updated create a transaction to reflect the change.
   giftcard.save(function(err) {
      if (err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.jsonp(giftcard);
      }
   });
   //TODO: come back and more too, not sure what to do with this data.
};

/**
 * Delete an Giftcard
 */
exports.delete = function(req, res) {
   var giftcard = req.giftcard;
   // The method gets called after the merchant enters the tricon and the amount has been transfered to him.
   // this is the final step to completing a transaction.
   // pay-out vendor create invoice,
   // delete giftcard
   // email vendor
   giftcard.remove(function(err) {
      if (err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.jsonp(giftcard);
      }
   });
};

/**
 * List of Giftcards
 */
exports.list = function(req, res) {
   // hopefully this will only list the giftcards assoicated with this user.
   Giftcard.find({
      toUser: req.user.id
   }).populate('user', 'displayName').exec(function(err, giftcards) {
      if (err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.jsonp(giftcards);
      }
   });
};
/**
 * Giftcard middleware
 */
exports.giftcardByID = function(req, res, next, id) {
   Giftcard.findById(id).populate('user').exec(function(err, giftcard) {
      if (err) return next(err);
      if (!giftcard) return next(new Error('Failed to load Giftcard ' + id));
      req.giftcard = giftcard;
      next();
   });
};

/**
 * Giftcard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
   if (req.giftcard.user.id !== req.user.id) {
      return res.status(403).send({
         message: 'User is not authorized'
      });
   }
   next();
};
