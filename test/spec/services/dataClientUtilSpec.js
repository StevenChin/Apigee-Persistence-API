'use strict';
/*
 * The set of tests for the apigee data client factory
 */
describe('DataClientUtil test suite:', function(){

  var dataClientUtil, dataValidationUtil, log;

  var mockApigeeCredentials = {
    orgName: 'myOrg',
    appName: 'myApp',
    username: 'testUser',
    password: 'myPassword'
  };

  var validUsername = 'validUsername';
  var invalidUsername = 'invalidUsername';

  var validPassword = 'validPassword';
  var invalidPassword = 'invalidPassword';

  var validationResults = {
    validUsername: true,
    invalidUsername: false,
    validPassword: true,
    invalidPassword: false
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

  var succesfulLogin = {'access_token':'authToken'};

  var validDataClientLoginSuccess = {
    monitoringEnabled: true,
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName,
    URI: 'https://api.usergrid.com',
    login: function(username, password, callback){
             callback(null, succesfulLogin);
           }
  };

  var loginError = 'login error';

  var validDataClientLoginFailure = {
    monitoringEnabled: true,
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName,
    URI: 'https://api.usergrid.com',
    login: function(username, password, callback){
             callback(loginError, null);
           }
  };

  beforeEach(module('apigeePersistenceApiApp'));

  beforeEach(inject(function($injector){
    dataClientUtil = $injector.get('DataClientUtil');
    log = $injector.get('$log');
    dataValidationUtil = $injector.get('DataValidationUtil');
  }));

  it('should define a initDataClient function', function(){
    expect(dataClientUtil.initDataClient).toBeDefined();
  });

  it('should define a login function', function(){
    expect(dataClientUtil.login).toBeDefined();
  });

  describe('The initDataClient function:', function(){
    it('should validate the orgName and appName params', function(){
      spyOn(dataValidationUtil,'isValidString');

      dataClientUtil.initDataClient(mockApigeeCredentials.orgName, mockApigeeCredentials.appName);

      expect(dataValidationUtil.isValidString).toHaveBeenCalled();
    });

    it('should return null when the orgName param is invalid', function(){
      var orgName = 123;

      //setup fake for isValidString function to return false for an invalid orgName
      spyOn(dataValidationUtil,'isValidString').andCallFake(function(param){
          if(param === 123){
            return false;
          }
          return true;
      });

      //setup log spy
      spyOn(log, 'error');

      var dataClient = dataClientUtil.initDataClient(orgName, mockApigeeCredentials.appName);

      expect(log.error).toHaveBeenCalled();
      expect(dataClient).toEqual(null);
    });

    it('should return null when the appName param is invalid', function(){
      var appName = 340;

      //setup fake for isValidString function to return false for an invalid appName
      spyOn(dataValidationUtil,'isValidString').andCallFake(function(param){
          if(param === 340){
            return false;
          }
          return true;
      });

      //setup log spy
      spyOn(log, 'error');

      var dataClient = dataClientUtil.initDataClient(mockApigeeCredentials.orgName, appName);

      expect(log.error).toHaveBeenCalled();
      expect(dataClient).toEqual(null);
    });

    it('should return null when the orgName and appName params are invalid', function(){
      var appName = 340;
      var orgName = 234;

      //return false for isValidString function for invalid orgName and appName
      spyOn(dataValidationUtil,'isValidString').andReturn(false);

      //setup log spy
      spyOn(log, 'error');

      var dataClient = dataClientUtil.initDataClient(orgName, appName);

      expect(log.error).toHaveBeenCalled();
      expect(dataClient).toEqual(null);
    });

    it('should return the initialized dataClient when the orgName and appName params are valid', function(){
      //return true for isValidString function for invalid orgName and appName
      spyOn(dataValidationUtil,'isValidString').andReturn(true);

      //setup log spy
      spyOn(log, 'error');

      var dataClient = dataClientUtil.initDataClient(mockApigeeCredentials.orgName, mockApigeeCredentials.appName);

      expect(log.error).not.toHaveBeenCalled();
      expect(dataClient).not.toEqual(null);
    });
  });

  describe('The login function:', function(){
    it('should log an error when the username is not a string', function(){
      //return false for username and true for password validation
      spyOn(dataValidationUtil, 'isValidString').andCallFake(function(param){
        return validationResults[param];
      });
      //return true for dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      //setup log spy
      spyOn(log, 'error');

      dataClientUtil.login(validDataClient, invalidUsername, validPassword);

      expect(log.error).toHaveBeenCalled();
    });

    it('should log an error when the password is not a string', function(){
      //return true for username and false for password validation
      spyOn(dataValidationUtil, 'isValidString').andCallFake(function(param){
        return validationResults[param];
      });
      //return true for dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      //setup log spy
      spyOn(log, 'error');

      dataClientUtil.login(validDataClient, validUsername, invalidPassword);

      expect(log.error).toHaveBeenCalled();
    });

    it('should log an error when the dataClient is invalid', function(){
      //return true for username and password validation
      spyOn(dataValidationUtil, 'isValidString').andCallFake(function(param){
        return validationResults[param];
      });
      //return false for dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(false);
      //setup log spy
      spyOn(log, 'error');

      dataClientUtil.login(invalidDataClient, validUsername, validPassword);

      expect(log.error).toHaveBeenCalled();
    });

    it('should log an error when the dataClient, username and password are invalid', function(){
      //return false for username and password validation
      spyOn(dataValidationUtil, 'isValidString').andReturn(false);
      //return false for dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(false);
      //setup log spy
      spyOn(log, 'error');

      dataClientUtil.login(invalidDataClient, validUsername, validPassword);

      expect(log.error).toHaveBeenCalled();
    });

    it('should log an error if login was unsuccessful given no callback and valid params', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction').andReturn(false);
      //setup log spy
      spyOn(log, 'error');

      dataClientUtil.login(validDataClientLoginFailure, validUsername, validPassword);

      expect(log.error).toHaveBeenCalled();
    });

    it('should validate the callback when it is passed and all the credentials are valid', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction');
      //setup log spy
      spyOn(log, 'error');

      var callback = jasmine.createSpy();

      dataClientUtil.login(validDataClientLoginFailure, validUsername, validPassword, callback);

      expect(dataValidationUtil.isValidFunction).toHaveBeenCalled();
    });

    it('should not call the invalid callback with the error response if login was unsuccessful', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction').andReturn(false);
      //setup log spy
      spyOn(log, 'error');

      var callback = jasmine.createSpy();

      dataClientUtil.login(validDataClientLoginFailure, validUsername, validPassword, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should call the valid callback with the error response if login was unsuccessful', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction').andReturn(true);
      //setup log spy
      spyOn(log, 'error');

      var callback = jasmine.createSpy();

      dataClientUtil.login(validDataClientLoginFailure, validUsername, validPassword, callback);

      expect(callback).toHaveBeenCalledWith(loginError, null);
    });

    it('should not call the invalid callback with the succesful response if login was succesful', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction').andReturn(false);
      //setup log spy
      spyOn(log, 'error');

      var callback = jasmine.createSpy();

      dataClientUtil.login(validDataClientLoginSuccess, validUsername, validPassword, callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should call the valid callback with the succesful response if login was succesful', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction').andReturn(true);
      //setup log spy
      spyOn(log, 'error');

      var callback = jasmine.createSpy();

      dataClientUtil.login(validDataClientLoginSuccess, validUsername, validPassword, callback);

      expect(callback).toHaveBeenCalledWith(null, succesfulLogin);
    });

    it('should not log an error if login was succesful', function(){
      //return true for username, password and dataClient validation
      spyOn(dataValidationUtil, 'isValidDataClient').andReturn(true);
      spyOn(dataValidationUtil, 'isValidString').andReturn(true);
      //spy for validating callback
      spyOn(dataValidationUtil, 'isValidFunction').andReturn(false);
      //setup log spy
      spyOn(log, 'error');

      dataClientUtil.login(validDataClientLoginSuccess, validUsername, validPassword);

      expect(log.error).not.toHaveBeenCalled();
    });
  });
});
