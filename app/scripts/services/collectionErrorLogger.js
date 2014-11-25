'use strict';
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
