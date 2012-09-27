Meteor.startup(function () {
  // code to run on server at startup
  console.log('server initiated.');
  console.log('have fun with meteor');
  console.log('%s Mode is running.', __meteor_runtime_config__.ROOT_URL);

  Messages.allow({
	  insert: function(id, doc) {
		  doc.createTime = Date.now();
		  return true;
	  }
  });

  if (!Meteor.accounts.configuration.find().count()) {
    config[__meteor_runtime_config__.ROOT_URL==='http://localhost:3000'
      ? "test" : "prod"].services.forEach(function(service) {
        console.dir(service);
        Meteor.accounts.configuration.insert(service);
    });
  }
});
