// Update this constant with your ServiceNow credentials
const options = {
  url: 'https://dev67893.service-now.com/', //old instance was 'https://dev60073.service-now.com/' but it lapsed
  username: 'admin',
  password: 'Escort89',
  serviceNowTable: 'change_request'
};

// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js.
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

/**
 * @function mainOnObject
 * @description Instantiates an object from the imported ServiceNowConnector class
 *   and tests the object's get and post methods.
 */
function mainOnObject() {
  // Instantiate an object from class ServiceNowConnector.
  const connector = new ServiceNowConnector(options);
  // Test the object's get and post methods.
  // You must write the arguments for get and post.
  connector.get((results, error) => {
      if (error) {
          console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
        }
      console.log(`\nResponse returned from GET request:\n${JSON.stringify(results)}`)
  });

  connector.post((results, error) => {
      if (error) {
          console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
      } 
      console.log(`\nResponse returned from POST request:\n${JSON.stringify(results)}`)
   });
}

// Call mainOnObject to run it.
mainOnObject();