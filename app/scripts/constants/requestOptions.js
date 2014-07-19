/**
 * @ngdoc function
 * @name apigeePersistenceApiApp.constant:RequestOptions
 * @description The set of constants used for configuring the options
 *      for Apigee collections, entities and requests
 * #RequestOptions
 */
angular.module('apigeePersistenceApiApp').constant('RequestOptions', {
  getCollection: {
                   'client':{},
                   'type':'',
                   'qs': {
                           'ql': '',
                           'limit':10
                         }
                  }
});
