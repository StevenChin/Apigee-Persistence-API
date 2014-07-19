'use strict';
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
