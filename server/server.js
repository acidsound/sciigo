Meteor.startup(function () {
  // code to run on server at startup
  console.log("server initiated.");
  console.log("have fun with meteor");
  console.log("%s Mode is running.", __meteor_runtime_config__.ROOT_URL);
  if (!Meteor.accounts.configuration.find().count()) {
    Meteor.accounts.configuration.insert(
      __meteor_runtime_config__.ROOT_URL==="http://localhost:3000" ?
        { "service" : "facebook", "appId" : "381547438582462", "secret" : "359f864a61d4c9223018df9e66b6a7bc"} :
        { "service" : "facebook", "appId" : "246175668838235", "secret" : "98159493c46e3975db8c1b764cd96e91"}
    );
  }
});
