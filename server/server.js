Meteor.startup(function () {
  // code to run on server at startup
  console.log('server initiated.');
  console.log('have fun with meteor');
  console.log('%s Mode is running.', __meteor_runtime_config__.ROOT_URL);
  isTest = __meteor_runtime_config__.ROOT_URL === 'http://localhost:3000';
  var serverStartTime = Date.now();
  Meteor.methods({
    "create_message":function (msg) {
      if (!!msg.message) {
        var row = {
          userName:msg.user.profile.name,
          message:msg.message,
          createTime:Date.now()
        };
        if (msg.page) {
          row.page = msg.page;
        }
        return Messages.insert(row);
      }
      return null;
    },
    "getServerStartTime" : function() {
      return serverStartTime;
    }
  });

  if (!Meteor.accounts.configuration.find().count()) {
    config[isTest ? "test" : "prod"].services.forEach(function (service) {
      console.dir(service);
      Meteor.accounts.configuration.insert(service);
    });
  }

  Meteor.publish('messages', function (page) {
    if (page) {
      return Messages.find({"page":page}, {sort:{createTime:-1}});
    } else {
      return Messages.find({}, {sort:{createTime:-1}});
    }
  });
});
