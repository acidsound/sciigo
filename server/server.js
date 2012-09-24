Meteor.startup(function () {
  // code to run on server at startup
  Meteor.accounts.facebook.setSecret('359f864a61d4c9223018df9e66b6a7bc');
  console.log("server initiated.");
  console.log("have fun with meteor");
  Messages.remove({});
  Messages.insert({userName:"Lee Jaeho", message:"Hi hello"});
  Messages.insert({userName:"ppillip", message:"Hwhat da hell"});
  Messages.insert({userName:"dehol", message:"miku banzai"});
});
