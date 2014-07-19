'use strict';
/*
 * @ngdoc service
 * @name apigeePersistenceApiApp.service:CollectionRepository
 * @description Service used for managing collections, performing basic CRUD operations.
 *    Additionally, functionality is provided to perform custom queries.
 * # CollectionRepository
 */
 angular.module('apigeePersistenceApiApp').service('CollectionRepository',['DataClientUtil', 'DataValidationUtil', '$log', 'RequestOptions',
   function(DataClientUtil, DataValidationUtil, $log, RequestOptions){
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
         $log.error('Initialization of collection could not be performed. At least one of the following occurred:\n' +
                    '- dataClient was invalid\n' +
                    '- type was invalid\n');
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
      * @name CollectionRepository:updateCollection
      * # updateCollection
      * @description Function used to append retrieved collection entities to the entities property of the service.
      * @param {object} erorr - error object with details of error that occured when trying to retrieve
      *      the collection.
      * @param {object} data - object containing entities retrived from a collection.
      */
     var updateCollection = function(error, data){
       if(error){
         $log.error(error);
       }
       else{
         if(DataValidationUtil.isValidDataEntities(data)){
          this.entities.push.apply(this.entities, data.entities);
         }
         else{
           logInvalidDataEntitiesError();
         }
       }
     };

     /**
      * @ngdoc function
      * @name CollectionRepository:logInvalidDataEntitiesError
      * # logInvalidDataEntitiesError
      * @description Function used to log an error when the entities property of a retrieved collection is invalid.
      */
     var logInvalidDataEntitiesError = function(){
       $log.error('Data Entities for collection is invalid. One of the following occurred:\n' +
                '- data entities is undefined\n' +
                '- data entities is null\n' +
                '- data entities is not an array\n');
     };

     /*
      * @ngdoc function
      * @name CollectionRepository:getAll
      * # getAll
      * @description Function used to retrieve all of the entities for a given collection
      * @param {Apigee.Collection} collection - apigee collection
      * @return {object|null} - the entities retrieved from the call to fetch the collection when successful,
      *     null when failed.
      */
     var getAll = function(collection){
        if(DataValidationUtil.isValidCollection(collection)){
          this.clearEntities();
          collection.fetch(function(error, data){
            if(error){
              $log.error(error);
            }
            else{
              if(DataValidationUtil.isValidDataEntities(data)){
                this.entities = data.entities;
                while(collection.hasNextPage()){
                  collection.getNextPage(updateCollection);
                }
              }
              else{
                logInvalidDataEntitiesError();
              }
            }
        });
        }
        else{
          $log.error('Entities from the collection could not be retrieved, collection was invalid');
        }
        return entities;
     };

     return{
       initCollection: initCollection,
       getAll: getAll,
       entities: entities,
       clearEntities: clearEntities
     };
}]);
