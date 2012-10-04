Meteor.startup(function () {
  // server side require
  var require = __meteor_bootstrap__.require;
  var path = require('path');
  var moment = require(path.resolve(".") + '/tests/server/node_modules/moment');

  // code to run on server at startup
  startTime = Date.now();
  ServerTime.insert({'startTime':startTime});
  console.log('server initiated at %s.',
    moment(startTime).format('YYYY/MM/DD HH:mm:ss')
  );
  console.log('%s Mode is running.', __meteor_runtime_config__.ROOT_URL);
  var isTest = __meteor_runtime_config__.ROOT_URL === 'http://localhost:3000';
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
        // simulate sleep
        for (var t = Date.now(); Date.now() < t + 2000;);
        return Messages.insert(row);
      }
      return null;
    },
    "getServerStartTime":function () {
      return serverStartTime;
    }
  });

  /* Meteor.accounts -> Accounts 로 변경 */
  if (!Accounts.configuration.find().count()) {
    config[isTest ? "test" : "prod"].services.forEach(function (service) {
      console.dir(service);
      Accounts.configuration.insert(service);
    });
  }

  Meteor.publish('messages', function (page) {
    var collection = [];
    if (page) {
      collection = Messages.find({"page":page}, {sort:{createTime:-1}});
    } else {
      collection = Messages.find({}, {sort:{createTime:-1}});
    }
    return collection;
  });

  Meteor.publish('serverTime', function () {
    return ServerTime.find({}, {sort:{startTime:-1}, limit:1});
  });
});
