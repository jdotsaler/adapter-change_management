// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {
   
   /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */

  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.
    this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }
  

 
  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect() {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.
    this.healthcheck();
  }
/**
 * @memberof ServiceNowAdapter
 * @method healthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 *   Calls method emitOnline if external system is available.
 *
 * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
 *   that handles the response.
 */
healthcheck(callback) {
   
   this.getRecord((_processedData, _processedError, _response ) => {
    console.log(`\nProcessed Response returned from Get in Health request:\n${JSON.stringify(_processedData)}`);

      if(_response.body.includes('Instance Hibernating page') && _response.body.includes('<html>') && _response.statusCode === 200) {
      this.emitStatus("OFFLINE");
       log.error('ServiceNow: Instance is hibernating.' + this.id);
   }
   if (_processedError) {
      this.emitStatus("OFFLINE");
      log.error( _processedError + this.id);
   } else {
        this.emitStatus("ONLINE");
        log.debug('ServiceNow: Instance is available.' + this.id);
   }
 });
}
 emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
   getRecord(callback) {
    var newJSON = [];
    var arrayOfArrays = [];
    this.connector.get((_processedData, _processedError) => { 
        var detectObject = typeof _processedData;
        var _response = _processedData;
        if(_processedData.body.includes('result')) {
        var recordCount = 1;
        for( var i = 0; i < recordCount; i++)    {
        let jsonData = JSON.parse(_processedData.body);
        var number = jsonData.result[i].number;
        var active = jsonData.result[i].active;
        var priority = jsonData.result[i].priority;
        var description = jsonData.result[i].description;
        var workStart = jsonData.result[i].work_start;
        var workEnd = jsonData.result[i].work_end;
        var sys_id = jsonData.result[i].sys_id;
   newJSON = { "change_ticket_number" : number, "active" : active , "priority" : priority , "description" : description , "work_start" : workStart , "work_end" : workEnd , "change_ticket_key" : sys_id };
   arrayOfArrays[i] = newJSON
    }
    _processedData = arrayOfArrays;
    }
    callback(_processedData, _processedError,_response);
    });
  }
   /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.node
   */
 postRecord(callback) {
    var newJSON = [];
  
  this.connector.post((_processedData, _processedError) => { 
   var detectObject = typeof _processedData;
    var _response = _processedData;
    if(_processedData.body.includes('result')) {
    let jsonData = JSON.parse(_processedData.body);
    var number = jsonData.result.number;
    var active = jsonData.result.active;
    var priority = jsonData.result.priority;
    var description = jsonData.result.description;
    var workStart = jsonData.result.work_start;
    var workEnd = jsonData.result.work_end;
    var sys_id = jsonData.result.sys_id;
   newJSON = { "change_ticket_number" : number, "active" : active , "priority" : priority , "description" : description , "work_start" : workStart , "work_end" : workEnd , "change_ticket_key" : sys_id };
   _processedData = newJSON;
    }
    callback(_processedData, _processedError, _response);
    });
  }
}
/**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.node
   */
  
module.exports = ServiceNowAdapter;