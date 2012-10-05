/* OAuth configuration
 * key : redirected URL
 * val : OAuth service configuration
 */
var config = {
  'http://localhost:3000':{
    services:[
      { "service":"facebook", "appId":"381547438582462", "secret":"359f864a61d4c9223018df9e66b6a7bc"}
    ]
  },
  'http://sciigo.meteor.com':{
    services:[
      { "service":"facebook", "appId":"246175668838235", "secret":"98159493c46e3975db8c1b764cd96e91"}
    ]
  }
};