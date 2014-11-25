'use strict';
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
