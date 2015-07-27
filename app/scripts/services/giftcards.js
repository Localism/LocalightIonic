'use strict';

/**
 * @ngdoc service
 * @name angularLocalightApp.giftcards
 * @description
 * # giftcards
 * Service in the angularLocalightApp.
 */
angular.module('angularLocalightApp')
  .service('Giftcards', function ($resource) {

      return $resource( '/giftcards',
          { }, {
              create: {
                  method: 'POST',
                  params: {},
                  isArray: false
              },
              get: {
                  method: 'GET',
                  params: {},
                  isArray: false
              }
          } );
  });