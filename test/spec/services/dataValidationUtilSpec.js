'use strict';
/*
 * The set of tests for the DataValidationUtil service
 */
describe('The DataValidationUtil test suite:', function(){
  var dataValidationUtil, log;

  var classes = {
    undefined: 'Undefined',
    null: 'Null',
    string: 'String',
    object: 'Object',
    number: 'Number',
    array: 'Array',
    boolean: 'Boolean',
    date: 'Date',
    error: 'Error'
  };

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
    URI: 'https://api.usergrid.com'
  };

  var dataClientNoMonitoring = {
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName,
    URI: 'https://api.usergrid.com'
  };

  var dataClientNoMonitor = {
    monitoringEnabled: true,
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName,
    URI: 'https://api.usergrid.com'
  };

  var dataClientNoOrgName = {
    monitoringEnabled: true,
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    appName: mockApigeeCredentials.appName,
    URI: 'https://api.usergrid.com'
  };

  var dataClientNoAppName = {
    monitoringEnabled: true,
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    orgName: mockApigeeCredentials.orgName,
    URI: 'https://api.usergrid.com'
  };

  var dataClientNoURI = {
    monitoringEnabled: true,
    monitor: {
      orgName: mockApigeeCredentials.orgName,
      appName: mockApigeeCredentials.appName,
      URI: 'https://api.usergrid.com'
    },
    orgName: mockApigeeCredentials.orgName,
    appName: mockApigeeCredentials.appName
  };

  var validCollection = {
    _client: validDataClient,
    _type: 'book',
    qs: {ql: '', limit: 20}
  };

  var collectionInvalidClient = {
    _client: dataClientNoURI,
    _type: 'book',
    qs: {ql: '', limit: 20}
  };

  var collectionNoClient = {
    _type: 'book',
    qs: {ql: '', limit: 20}
  };

  var collectionNoType = {
    _client: validDataClient,
    qs: {ql: '', limit: 20}
  };

  var collectionNoQueryString = {
    _client: validDataClient,
    _type: 'book'
  };

  beforeEach(module('apigeePersistenceApiApp'));

  beforeEach(inject(function($injector){
    dataValidationUtil = $injector.get('DataValidationUtil');
    log = $injector.get('$log');
  }));

  describe('The getDataType method:', function(){
    it('should return \'Undefined\' if an undefined variable is passed', function(){
      var undefinedObj;

      var dataType = dataValidationUtil.getDataType(undefinedObj);

      expect(dataType).toEqual(classes['undefined']);
    });

    it('should return \'Null\' if a null variable is passed', function(){
      var nullObj = null;

      var dataType = dataValidationUtil.getDataType(nullObj);

      expect(dataType).toEqual(classes.null);
    });

    it('should return \'String\' if a string is passed', function(){
      var stringObj = '';

      var dataType = dataValidationUtil.getDataType(stringObj);

      expect(dataType).toEqual(classes.string);
    });

    it('should return \'Object\' if an object is passed', function(){
      var obj = {};

      var dataType = dataValidationUtil.getDataType(obj);

      expect(dataType).toEqual(classes.object);
    });

    it('should return \'Number\' if a number is passed', function(){
      var number = 123;

      var dataType = dataValidationUtil.getDataType(number);

      expect(dataType).toEqual(classes.number);
    });

    it('should return \'Array\' if an array is passed', function(){
      var ary = [];

      var dataType = dataValidationUtil.getDataType(ary);

      expect(dataType).toEqual(classes.array);
    });

    it('should return \'Boolean\' if a boolean is passed', function(){
      var bool = true;

      var dataType = dataValidationUtil.getDataType(bool);

      expect(dataType).toEqual(classes.boolean);
    });

    it('should return \'Date\' if a date is passed', function(){
      var date = new Date();

      var dataType = dataValidationUtil.getDataType(date);

      expect(dataType).toEqual(classes.date);
    });

    it('should return \'Error\' if an error is passed', function(){
      var error = new Error();

      var dataType = dataValidationUtil.getDataType(error);

      expect(dataType).toEqual(classes.error);
    });
  });

  describe('The isValidString method:', function(){
    it('should call the getDataType method', function(){
      var obj;
      spyOn(dataValidationUtil, 'getDataType');

      dataValidationUtil.isValidString(obj);

      expect(dataValidationUtil.getDataType).toHaveBeenCalled();
    });

    it('should return false if the parameter passed was undefined', function(){
      var obj;

      var isValidString = dataValidationUtil.isValidString(obj);

      expect(isValidString).toEqual(false);
    });

    it('should return false if the parameter passed was null', function(){
      var obj = null;

      var isValidString = dataValidationUtil.isValidString(obj);

      expect(isValidString).toEqual(false);
    });

    it('should return false if the parameter passed was a number', function(){
      var obj = 123;

      var isValidString = dataValidationUtil.isValidString(obj);

      expect(isValidString).toEqual(false);
    });

    it('should return true if the parameter passed was a string', function(){
      var obj = '';

      var isValidString = dataValidationUtil.isValidString(obj);

      expect(isValidString).toEqual(true);
    });
  });

  describe('The isValidDataClient method:', function(){
    it('should return false if the parameter passed was undefined', function(){
      var obj;

      var isValidDataClient = dataValidationUtil.isValidDataClient(obj);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return false if the parameter passed was null', function(){
      var obj = null;

      var isValidDataClient = dataValidationUtil.isValidDataClient(obj);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return false if the parameter does not have the \'monitoringEnabled\' property', function(){
      var isValidDataClient = dataValidationUtil.isValidDataClient(dataClientNoMonitoring);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return false if the parameter does not have the \'monitor\' property', function(){
      var isValidDataClient = dataValidationUtil.isValidDataClient(dataClientNoMonitor);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return false if the parameter does not have the \'orgName\' property', function(){
      var isValidDataClient = dataValidationUtil.isValidDataClient(dataClientNoOrgName);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return false if the parameter does not have the \'appName\' property', function(){
      var isValidDataClient = dataValidationUtil.isValidDataClient(dataClientNoAppName);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return false if the parameter does not have the \'URI\' property', function(){
      var isValidDataClient = dataValidationUtil.isValidDataClient(dataClientNoURI);

      expect(isValidDataClient).toEqual(false);
    });

    it('should return true if the parameter has the necessary properties for a data client', function(){
      var isValidDataClient = dataValidationUtil.isValidDataClient(validDataClient);

      expect(isValidDataClient).toEqual(true);
    });
  });

  describe('The isValidNumber method:', function(){
    it('should call the getDataType method', function(){
      var obj;

      spyOn(dataValidationUtil, 'getDataType');

      dataValidationUtil.isValidNumber(obj);

      expect(dataValidationUtil.getDataType).toHaveBeenCalled();
    });

    it('should return false if the parameter passed was undefined', function(){
      var obj;

      var isValidNumber = dataValidationUtil.isValidNumber(obj);

      expect(isValidNumber).toEqual(false);
    });

    it('should return false if the parameter passed was null', function(){
      var obj = null;

      var isValidNumber = dataValidationUtil.isValidNumber(obj);

      expect(isValidNumber).toEqual(false);
    });

    it('should return false if the parameter passed was a string', function(){
      var obj = '';

      var isValidNumber = dataValidationUtil.isValidNumber(obj);

      expect(isValidNumber).toEqual(false);
    });

    it('should return true if the parameter passed was a number', function(){
      var obj = 123;

      var isValidNumber = dataValidationUtil.isValidNumber(obj);

      expect(isValidNumber).toEqual(true);
    });
  });

  describe('The isValidFunction method:', function(){
    it('should call the getDataType method', function(){
      var obj;

      spyOn(dataValidationUtil, 'getDataType');

      dataValidationUtil.isValidFunction(obj);

      expect(dataValidationUtil.getDataType).toHaveBeenCalled();
    });

    it('should return false if the parameter passed was undefined', function(){
      var obj;

      var isValidFunction = dataValidationUtil.isValidFunction(obj);

      expect(isValidFunction).toEqual(false);
    });

    it('should return false if the parameter passed was null', function(){
      var obj = null;

      var isValidFunction = dataValidationUtil.isValidFunction(obj);

      expect(isValidFunction).toEqual(false);
    });

    it('should return false if the parameter passed was a string', function(){
      var obj = '';

      var isValidFunction = dataValidationUtil.isValidFunction(obj);

      expect(isValidFunction).toEqual(false);
    });

    it('should return false if the parameter passed was a number', function(){
      var obj = 123;

      var isValidFunction = dataValidationUtil.isValidFunction(obj);

      expect(isValidFunction).toEqual(false);
    });

    it('should return true if the parameter passed was a function', function(){
      var obj = function(){};

      var isValidFunction = dataValidationUtil.isValidFunction(obj);

      expect(isValidFunction).toEqual(true);
    });
  });

  describe('The isValidCollection method:', function(){
    it('should return false if the parameter passed was undefined', function(){
      var obj;

      var isValidCollection = dataValidationUtil.isValidCollection(obj);

      expect(isValidCollection).toEqual(false);
    });

    it('should return false if the parameter passed was null', function(){
      var obj = null;

      var isValidCollection = dataValidationUtil.isValidCollection(obj);

      expect(isValidCollection).toEqual(false);
    });

    it('should return false if the parameter does not have the \'_client\' property', function(){
      var isValidCollection = dataValidationUtil.isValidCollection(collectionNoClient);

      expect(isValidCollection).toEqual(false);
    });

    it('should return false if the parameter\'s \'_client\' property is invalid', function(){
      var isValidCollection = dataValidationUtil.isValidCollection(collectionInvalidClient);

      expect(isValidCollection).toEqual(false);
    });

    it('should return false if the parameter does not have the \'_type\' property', function(){
      var isValidCollection = dataValidationUtil.isValidCollection(collectionNoType);

      expect(isValidCollection).toEqual(false);
    });

    it('should return false if the parameter does not have the \'qs\' property', function(){
      var isValidCollection = dataValidationUtil.isValidCollection(collectionNoQueryString);

      expect(isValidCollection).toEqual(false);
    });

    it('should return true if the parameter has the necessary properties for a collection', function(){
      var isValidCollection = dataValidationUtil.isValidCollection(validCollection);

      expect(isValidCollection).toEqual(true);
    });
  });

  describe('The isValidDataEntities method:', function(){
    it('should return false if the parameter passed was undefined', function(){
      var obj;

      var isValidDataEntities = dataValidationUtil.isValidDataEntities(obj);

      expect(isValidDataEntities).toEqual(false);
    });

    it('should return false if the parameter passed was null', function(){
      var obj = null;

      var isValidDataEntities = dataValidationUtil.isValidDataEntities(obj);

      expect(isValidDataEntities).toEqual(false);
    });

    it('should return false if the parameter passed does not have an \'entities\' property', function(){
      var obj = {name: 'tommy'};

      var isValidDataEntities = dataValidationUtil.isValidDataEntities(obj);

      expect(isValidDataEntities).toEqual(false);
    });

    it('should call the getDataType function if the parameter passed has an \'entities\' property', function(){
      var obj = {entities: {}};

      spyOn(dataValidationUtil, 'getDataType');

      var isValidDataEntities = dataValidationUtil.isValidDataEntities(obj);

      expect(isValidDataEntities).toEqual(false);
    });

    it('should return false if the parameter passed has an \'entities\' property and its value is not an array', function(){
      var obj = {entities: ''};

      spyOn(dataValidationUtil, 'getDataType').andReturn('String');

      var isValidDataEntities = dataValidationUtil.isValidDataEntities(obj);

      expect(isValidDataEntities).toEqual(false);
    });

    it('should return true if the parameter passed has an \'entities\' property and its value is an array', function(){
      var obj = {entities: []};

      spyOn(dataValidationUtil, 'getDataType').andReturn('Array');

      var isValidDataEntities = dataValidationUtil.isValidDataEntities(obj);

      expect(isValidDataEntities).toEqual(true);
    });
  });
});
