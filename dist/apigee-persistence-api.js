'use strict';
// Source: app/scripts/services/collectionRepository.js
/*
 * @ngdoc service
 * @name apigeePersistenceApiApp.service:CollectionRepository
 * @description Service used for managing collections, performing basic CRUD operations.
 *    Additionally, functionality is provided to perform custom queries.
 * # CollectionRepository
 */
 angular.module('apigeePersistenceApiApp').service('CollectionRepository',['DataClientUtil', 'DataValidationUtil', '$log', 'RequestOptions', 'CollectionErrorLogger',
   function(DataClientUtil, DataValidationUtil, $log, RequestOptions, CollectionErrorLogger){
     /*
      * @ngdoc function
      * @name CollectionRepository:initCollection
      * # initCollection
      * @description Function used to initialize a collection (assumes the collection was already created).
      *      A collection represents the set of entities of the specified type that can be returned from
      *      the apigee API. Queries and limits can be used to modfify the result set for the
      *      initialized collection.
      * @param {Apigee.Client} dataClient - apigee data client
      * @param {string} type - the type of collection
      * @param {string} [query=''] - the query string to be used for the creating the collection
      * @param {string} [limit=10] - the maximum number of results to be returned
      * @return {Apigee.Collection|null} - the initialized apigee collection when initialization was successful,
      *      null when initialization failed
      */
     var initCollection = function(dataClient, type, query, limit){
       var collection = null;
       if(DataValidationUtil.isValidDataClient(dataClient) && DataValidationUtil.isValidString(type)){
         var options = angular.copy(RequestOptions.getCollection);
         options.client = dataClient;
         options.type = type;
         if(query && DataValidationUtil.isValidString(query)){
           options.qs.ql = query;
         }
         if(limit && DataValidationUtil.isValidNumber(limit)){
           options.qs.limit = limit;
         }
         collection = new Apigee.Collection(options);
       }
       else{
         CollectionErrorLogger.initializationFailure();
       }
       return collection;
     };

     //entities object
     var entities = [];

     /**
      * @ngdoc function
      * @name CollectionRepository:clearEntities
      * # clearEntities
      * @description Function used to set the contents of the entites property to an empty array.
      */
     var clearEntities = function(){
       this.entities = [];
     };

     /**
      * @ngdoc function
      * @name CollectionRepository:updateCollectionEntities
      * # updateCollection
      * @description Function used to append retrieved collection entities to the entities property of the service.
      * @param {object} erorr - error object with details of error that occured when trying to retrieve
      *      the collection.
      * @param {object} data - object containing entities retrived from a collection.
      */
     var updateCollectionEntities = function(error, data){
       if(error){
         $log.error(error);
       }
       else{
         if(DataValidationUtil.isValidDataEntities(data)){
          this.entities.push.apply(this.entities, data.entities);
         }
         else{
           CollectionErrorLogger.invalidDataEntities();
         }
       }
     };

     /*
      * @ngdoc function
      * @name CollectionRepository:getAll
      * # getAll
      * @description Function used to retrieve all of the entities for a given collection
      * @param {Apigee.Collection} collection - apigee collection
      * @param @param {function} [callback] - function to be called to process the result of the collection retrieval
      */
     var getAll = function(collection, callback){
        if(DataValidationUtil.isValidCollection(collection)){
          this.clearEntities();
          collection.fetch(function(error, data){
            if(error){
              callback(error, null);
            }
            else{
              if(DataValidationUtil.isValidDataEntities(data)){
                this.entities = data.entities;
                while(collection.hasNextPage()){
                  collection.getNextPage(updateCollectionEntities);
                }
                callback(null, this.entities);
              }
              else{
                callback(CollectionErrorLogger.invalidDataEntitiesMsg, null);
              }
            }
        });
        }
        else{
          callback(CollectionErrorLogger.invalidCollectionMsg, null);
        }
     };

     return{
       initCollection: initCollection,
       getAll: getAll,
       entities: entities,
       clearEntities: clearEntities
     };
}]);

// Source: app/scripts/services/dataClientUtil.js
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

// Source: app/scripts/services/dataValidationUtil.js
/*
 * @ngdoc service
 * @name apigeePersistenceApiApp.service:DataValidationUtil
 * # DataValidationUtil
 * Service used to check data types and validate variables
 */
angular.module('apigeePersistenceApiApp').service('DataValidationUtil', [
  function(){
    /*
     * @ngdoc function
     * @name DataValidationUtil:getDataType
     * # getDataType
     * @description Function is used to get the data type (object prototype) of the object that
     *      is passed to it. Also accounts for null and undefined objects.
     * @param {object} obj - object to determine the data type of
     * @return {string} - value of the prototype property (i.e data type)
     *      of the object.
     */
    var getDataType = function(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1);
    };

    /*
     * @ngdoc function
     * @name DataValidationUtil:isValidString
     * # isValidString
     * @description Function is used to indicate if the parameter passed was a valid string.
     * @param {obj} obj - object to validate
     * @return {boolean} - indicates if the value passed was a valid string.
     */
    var isValidString =  function(obj){
      if(this.getDataType(obj) === 'String'){
        return true;
      }
      else{
        return false;
      }
    };

    /*
     * @ngdoc function
     * @name DataValidationUtil:isValidDataClient
     * # isValidDataClient
     * @description Function is used to indicate if the parameter passed was a valid apigee data client.
     * @param {obj} obj - object to validate
     * @return {boolean} - indicates if the value passed was a valid apigee data client.
     */
    var isValidDataClient = function(obj){
      if(obj === undefined || obj === null){
        return false;
      }
      if(obj.hasOwnProperty('monitoringEnabled') && obj.hasOwnProperty('monitor') &&
         obj.hasOwnProperty('orgName') && obj.hasOwnProperty('appName') &&
         obj.hasOwnProperty('URI')){
           return true;
      }
      else{
        return false;
      }
    };

    /*
     * @ngdoc function
     * @name DataValidationUtil:isValidNumber
     * # isValidNumber
     * @description Function is used to indicate if the parameter passed was a valid number.
     * @param {obj} obj - object to validate
     * @return {boolean} - indicates if the value passed was a valid number.
     */
    var isValidNumber =  function(obj){
      if(this.getDataType(obj) === 'Number'){
        return true;
      }
      else{
        return false;
      }
    };

    /*
     * @ngdoc function
     * @name DataValidationUtil:isValidFunction
     * # isValidFunction
     * @description Function is used to indicate if the parameter passed was a valid function.
     * @param {obj} obj - object to validate
     * @return {boolean} - indicates if the value passed was a valid function.
     */
    var isValidFunction =  function(obj){
      if(this.getDataType(obj) === 'Function'){
        return true;
      }
      else{
        return false;
      }
    };

    /*
     * @ngdoc function
     * @name DataValidationUtil:isValidCollection
     * # isValidCollection
     * @description Function is used to indicate if the parameter passed was a valid apigee collection.
     * @param {obj} obj - object to validate
     * @return {boolean} - indicates if the value passed was a valid apigee collection.
     */
    var isValidCollection = function(obj){
      if(obj === undefined || obj === null){
        return false;
      }
      if(obj.hasOwnProperty('_client') && this.isValidDataClient(obj._client) &&
         obj.hasOwnProperty('_type') && obj.hasOwnProperty('qs')){
           return true;
      }
      else{
        return false;
      }
    };

    /**
     * @ngdoc function
     * @name DataValidationUtil:isValidDataEntities
     * # isValidDataEntities
     * @description Function is used to indicate if the parameter passed was a valid apigee data entities.
     * @param {obj} obj - object to validate
     * @return {boolean} result - indicates if the value passed was a valid apigee data entities.
     */
    var isValidDataEntities = function(obj){
      var result = false;
      if(obj && obj.entities && this.getDataType(obj.entities) === 'Array'){
        result = true;
      }
      return result;
    };

    return{
        getDataType: getDataType,
        isValidString: isValidString,
        isValidDataClient: isValidDataClient,
        isValidNumber: isValidNumber,
        isValidFunction: isValidFunction,
        isValidCollection: isValidCollection,
        isValidDataEntities: isValidDataEntities
    };
}]);

// Source: app/scripts/services/collectionErrorLogger.js
/*
* @ngdoc service
* @name apigeePersistenceApiApp.service:CollectionErrors
* @description Service used for logging apigee collection related errors.
* # CollectionErrors
*/
angular.module('apigeePersistenceApiApp').service('CollectionErrorLogger', ['$log',
  function($log){

    var invalidDataEntitiesMsg = 'Data Entities for collection is invalid. One of the following occurred:\n' +
                                 '- data entities is undefined\n' +
                                 '- data entities is null\n' +
                                 '- data entities is not an array\n';

    var invalidCollectionMsg = 'Entities from the collection could not be retrieved, collection was invalid';

    var initializationFailureMsg = 'Initialization of collection could not be performed. At least one of the following occurred:\n' +
                                   '- dataClient was invalid\n' +
                                   '- type was invalid\n';
    /**
    * @ngdoc function
    * @name CollectionRepository:invalidDataEntities
    * # invalidDataEntities
    * @description Function used to log an error when the entities property of a retrieved collection is invalid.
    */
    var invalidDataEntities = function(){
      $log.error(invalidDataEntitiesMsg);
    };

    /**
    * @ngdoc function
    * @name CollectionRepository:invalidCollection
    * # invalidCollection
    * @description Function used to log an error when a collection is invalid.
    */
    var invalidCollection = function(){
      $log.error(invalidCollectionMsg);
    };

    /**
    * @ngdoc function
    * @name CollectionRepository:initializationFailure
    * # initializationFailure
    * @description Function used to log an error when a collection failed to intialize.
    */
    var initializationFailure = function(){
      $log.error(initializationFailureMsg);
    };

    return{
      invalidDataEntities: invalidDataEntities,
      invalidDataEntitiesMsg: invalidDataEntitiesMsg,
      invalidCollection: invalidCollection,
      invalidCollectionMsg: invalidCollectionMsg,
      initializationFailure: initializationFailure,
      initializationFailureMsg: initializationFailureMsg
    };
}]);

// Source: app/scripts/constants/requestOptions.js
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
