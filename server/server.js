Meteor.startup(function () {
  // code to run on server at startup
  console.log("server initiated.");
  console.log("have fun with meteor");
  Messages.remove({});
  Messages.insert({userName:"Lee Jaeho", message:"Hi hello"});
  Messages.insert({userName:"ppillip", message:"Hwhat da hell"});
  Messages.insert({userName:"dehol", message:"miku banzai"});
});
