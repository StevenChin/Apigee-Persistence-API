'use strict';
/**
 * @ngdoc function
 * @name apigeePersistenceApiApp.constant:RequestOptions
 * @description The set of constants used for configuring the options
 *      for Apigee collections, entities and requests
 * #RequestOptions
 */
angular.module('apigeePersistenceApiApp').constant('RequestOptions', (function (){
  return{
    getCollection: {
      'client':{},
      'type':'',
      'qs': {
        'ql': '',
        'limit':10
      }
    }
  };
})());
