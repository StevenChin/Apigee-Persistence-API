'use strict';
/*
 * @ngdoc function
 * @name apigeePersistenceApiApp.factory:DataClientUtil
 * @description Service for setting up an instance of an apigee dataClient.
 *     A login function is provided in addition to the instance
 *     the dataClient.
 * # DataClientUtil
 */
 angular.module('apigeePersistenceApiApp').service('DataClientUtil', ['$log', 'DataValidationUtil',
   function($log, DataValidationUtil){
     /*
      * @ngdoc function
      * @name  DataClientUtil:initDataClient
      * # initDataClient
      * @description Function used to intialize an apigee data client with an application name and
      *      organization name
      * @param {string} orgName - the name of organization used with Apigee
      * @param {string} appName - the name of the application to be used with Apigee
      * @return {Apigee.Client|null} - the successfully initialized data client or an
      *      explicit null variable to indicate that initialzation failed
      */
     var initDataClient = function(orgName, appName){
        var dataClient = null;
        if(DataValidationUtil.isValidString(orgName) && DataValidationUtil.isValidString(appName)){
            dataClient = new Apigee.Client({
              orgName: orgName,
              appName: appName
            });
        }
        else{
          $log.error('Intialization of data client could not be performed. At least one of the following occurred:\n' +
                     '- orgName was invalid\n' +
                     '- appName was invalid\n');
        }
        return dataClient;
     };

     /*
      * @ngdoc function
      * @name DataClientUtil:login
      * # login
      * @description Function used to log into the Apigee API in order to
      *      request and manipulate entities and collections.
      * @param {Apigee.Client} dataClient - apigee data client
      * @param {string} username - the user to log in to the API with
      * @param {string} password - the password for the user
      * @param {function} [callback] - function to be called to process the result of the login process
      *     the callback takes the form callback(error, data), where data is the authentication token.
      */
     var login = function(dataClient, username, password, callback){
        if(DataValidationUtil.isValidString(username) && DataValidationUtil.isValidString(password) &&
           DataValidationUtil.isValidDataClient(dataClient) ){

          //determine if callback is a valid function
          //also takes into consideration if the callback param was passed
          var validCallback = DataValidationUtil.isValidFunction(callback);

          dataClient.login(username, password, function (error, data){
            if(error) {
              //error — could not log user in
              $log.error('login error: ' +error);
              if(validCallback){
                callback(error, null);
              }
            } else {
                //success — user has been logged in
                if(validCallback){
                    callback(null, data);
                }
            }
          });
        }
        else{
          $log.error('Login could not be performed. At least one of the following occurred:\n' +
                     '- username was invalid\n' +
                     '- password was invalid\n' +
                     '- dataClient was invalid');
        }
    };

    return{
      initDataClient: initDataClient,
      login: login
    };
}]);
