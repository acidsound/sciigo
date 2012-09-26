Meteor.startup(function () {
  // code to run on server at startup
  console.log("server initiated.");
  console.log("have fun with meteor");
  if (!Meteor.accounts.configuration.find().count()) {
    Meteor.accounts.configuration.insert({ "service" : "facebook", "appId" : "381547438582462", "secret" : "359f864a61d4c9223018df9e66b6a7bc"});
  }
});
