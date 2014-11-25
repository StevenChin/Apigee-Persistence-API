'use strict'; 
/**
 * @ngdoc function
 * @name apigeePersistenceApiApp.constants:ApigeeCredentials
 * @description
 * #ApigeeCredentials
 * The set of constants used for initializing an apigee data client
 */
angular.module('apigeePersistenceApiApp').constant('ApigeeCredentials', (function (){
  return{
    orgName: 'proxis',
    appName: 'sandbox',
    username: 'schin',
    password: 'Casava322'
  };
})());
