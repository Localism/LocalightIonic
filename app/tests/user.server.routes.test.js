// <!-- 'use strict';
//
// var should = require('should'),
//    request = require('supertest'),
//    app = require('../../server'),
//    mongoose = require('mongoose'),
//    User = mongoose.model('User'),
//    agent = request.agent(app);
//
// /**
//  * Globals
//  */
//
// var credentials, user, user2;
//
// /**
//  * User routes Tests
//  */
// describe('User-Auth Tests', function() {
//    // I just want to test to see if I pass in a user name if the method will
//    // create the user or not.
//    beforeEach(function(done) {
//
//       credentials = {
//          username: '1234567890',
//          password: 'password'
//       }; // end credentials
//
//       user = new User({
//          firstName: 'Clark',
//          lastName: 'Kent',
//          email: 'test@test.com',
//          username: credentials.username,
//          password: credentials.password,
//          provider: 'local',
//          stripeCustomerToken: 'cus_6KW9JPW77VzgP4',
//          stripeCardToken: {
//             primary: 'card_167r8DBNPqu3SRN2pr9dO9Pk'
//          }
//       }); // end user.
//       user.save();
//       done();
//    }); // end before each
//    // I could do two types of test.
//    // one to test if the user already exists, and match against the id I get back.
//    // and another to see if the user gets created.
//    it('should be able to successfully return a users id based off username/phonenumber', function(done) {
//       agent.post('/authsignin')
//          .send(credentials)
//          .expect(200)
//          .end(function(signinErr, signinRes) {
//             console.log(signinErr);
//             console.log(signinRes);
//             // Handle signin error
//             if (signinErr) done(signinErr);
//             // get the user id, we won't be using it though
//             var mobileNumber = '2223334444';
//             agent.post('/auth/findOrCreateUser')
//                .send(mobileNumber)
//                .expect(200)
//                .end(function(findOrCreateUserErr, findOrCreateUserRes) {
//                   should.not.exist(findOrCreateUserErr);
//                   // Handle Stripe Save Error
//                   done(findOrCreateUserErr);
//                });
//          }); //end signin function
//    });
//    afterEach(function(done){
//       User.remove.exec();
//       done();
//    });
// });//End User-Auth Test
//
//
//
// /**
//  * User-stripe routes Tests
//  */
//
// // describe('User-Stripe CRUD tests', function() {
// //    // setup a user who already has a valid stripe id and credentials
// //
// //    before(function(done) {
// //       credentials = {
// //          username: '1234567890',
// //          password: 'password'
// //       }; // end credentials
// //
// //       // Create a new user with valid stripe credentials
// //       user = new User({
// //          firstName: 'Clark',
// //          lastName: 'Kent',
// //          email: 'test@test.com',
// //          username: credentials.username,
// //          password: credentials.password,
// //          provider: 'local',
// //          stripeCustomerToken: 'cus_6KW9JPW77VzgP4', // pre-created in stripe db.
// //          stripeCardToken: {
// //             primary: 'card_167r8DBNPqu3SRN2pr9dO9Pk' // pre-created in stripe db.
// //          }
// //       }); // end user
// //       user.save();
// //    }); // end before each block
// //    it('should be able to successfully charge a user if logged in', function(done) {
// //       agent.post('/authsignin')
// //          .send(credentials)
// //          .expect(200)
// //          .end(function(signinErr, signinRes) {
// //             console.log(signinErr);
// //             console.log(signinRes);
// //             // Handle signin error
// //             if(signinErr) done(signinErr);
// //             // get the user id, we won't be using it though
// //             var userId = user.id;// this is a variable to compare things too.
// //             var amount = 2000;
// //             agent.post('/stripe/charge')
// //             .send(amount)
// //             .expect(200)
// //             .end(function(stripeSaveErr, stripeSaveRes){
// //                (stripeSaveRes.body.status).should.match('succeeded');
// //                // Handle Stripe Save Error
// //                done(stripeSaveErr);
// //             });
// //          }); //end signin function
// //    }); // end test block for charge
// //
// //    afterEach(function(done) {
// //       User.remove().exec();
// //       done();
// //    }); // end after each block
// //
// // }); // end describe block for user stripe tests -->
