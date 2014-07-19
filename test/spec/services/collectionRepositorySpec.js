'use strict';
/*
 * The set of tests for the apigee CollectionRepository service
 */
describe('The CollectionRepository test suite:', function(){
  var dataValidationUtil, collectionRepository, log;

  var requestOptions;

  var mockApigeeCredentials = {
    orgName: 'myOrg',
    appName: 'myApp',
    username: 'testUser',
    password: 'myPassword'
  };

  var validDataClient = {
    monitoringEnabled: true,
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName,
    URI: 'https://api.usergrid.com',
    login: jasmine.createSpy()
  };

  var invalidDataClient = {
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName,
    login: jasmine.createSpy()
  };

  var validType = 'customers';
  var invalidType = 123;

  var validQuery = 'select * where author contains \'Fred\'';
  var invalidQuery = null;

  var validLimit = 20;
  var invalidLimit = '21';

  var isValidStringReturnUtil = function(param){
    if(param === undefined || param === null){
        return false;
    }
    else{
        return true;
    }
  };

  beforeEach(module('apigeePersistenceApiApp'));

  beforeEach(inject(function($injector){
    dataValidationUtil = $injector.get('DataValidationUtil');
    collectionRepository = $injector.get('CollectionRepository');
    log = $injector.get('$log');
    requestOptions = $injector.get('RequestOptions');
  }));

  it('should define an \'entities\' property', function(){
    expect(collectionRepository.entities).toBeDefined();
  });

  describe('The initCollection method:', function(){
    it('should log an error if the dataClient parameter is invalid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(false);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      spyOn(log, 'error');

      collectionRepository.initCollection(invalidDataClient, validType);

      expect(log.error).toHaveBeenCalled();
    });

    it('should log an error if the type parameter is invalid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(false);
      spyOn(dataValidationUtil, 'isValidNumber').andReturn(true);
      spyOn(log, 'error');

      collectionRepository.initCollection(validDataClient, invalidType);

      expect(log.error).toHaveBeenCalled();
    });

    it('should initialize an apigee collection with the default options, when valid required parameters are passed', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);

      var collection = collectionRepository.initCollection(validDataClient, validType);

      expect(collection.qs.ql).toEqual(requestOptions.getCollection.qs.ql);
      expect(collection.qs.limit).toEqual(requestOptions.getCollection.qs.limit);
    });

    it('should initialize an apigee collection with the required parameters passed, when they are valid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);

      var collection = collectionRepository.initCollection(validDataClient, validType);

      expect(collection._client).toEqual(validDataClient);
      expect(collection._type).toEqual(validType);
    });

    it('should initialize an apigee collection with the default ql (query language), when the qs (query string) passed is invalid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andCallFake(isValidStringReturnUtil);
      spyOn(dataValidationUtil, 'isValidNumber').andReturn(true);

      var collection = collectionRepository.initCollection(validDataClient, validType, invalidQuery, validLimit);

      expect(collection.qs.ql).toEqual(requestOptions.getCollection.qs.ql);
    });

    it('should initialize an apigee collection with its ql (query language) as the qs (query string) parameter passed, when it is valid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andCallFake(isValidStringReturnUtil);
      spyOn(dataValidationUtil, 'isValidNumber').andReturn(true);

      var collection = collectionRepository.initCollection(validDataClient, validType, validQuery, validLimit);

      expect(collection.qs.ql).toEqual(validQuery);
    });

    it('should initialize an apigee collection with the default limit, when the limit passed is invalid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andCallFake(isValidStringReturnUtil);
      spyOn(dataValidationUtil, 'isValidNumber').andReturn(false);

      var collection = collectionRepository.initCollection(validDataClient, validType, null, invalidLimit);

      expect(collection.qs.limit).toEqual(requestOptions.getCollection.qs.limit);
    });

    it('should initialize an apigee collection with its limit as the limit parameter passed, when it is valid', function(){
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andCallFake(isValidStringReturnUtil);
      spyOn(dataValidationUtil, 'isValidNumber').andReturn(true);

      var collection = collectionRepository.initCollection(validDataClient, validType, null, validLimit);
      expect(collection.qs.limit).toEqual(validLimit);
    });
  });
});
