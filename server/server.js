Meteor.startup(function () {
  // code to run on server at startup
  console.log("server initiated.");
  console.log("have fun with meteor");
  Meteor.accounts.configuration.remove({});
  Meteor.accounts.configuration.insert({ "service" : "facebook", "appId" : "381547438582462", "secret" : "359f864a61d4c9223018df9e66b6a7bc"});
  Messages.remove({});
  Messages.insert({userName:"Lee Jaeho", message:"Hi hello"});
  Messages.insert({userName:"ppillip", message:"Hwhat da hell"});
  Messages.insert({userName:"dehol", message:"miku banzai"});
});
