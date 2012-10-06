Meteor.startup(function () {
  // server side require
  var require = __meteor_bootstrap__.require;
  var path = require('path');
  var base = path.resolve('.');
  var isBundle = path.existsSync(base + '/bundle');
  console.log('deploy mode: %s', isBundle ? 'bundle' : 'meteor');
  var modulePath = base + (isBundle ? '/bundle/static' : '/public') + '/node_modules';

  // code to run on server at startup
  var moment = require(modulePath + '/moment');
  startTime = Date.now();
  ServerTime.insert({'startTime':startTime});
  console.log('server initiated at %s.',
    moment(startTime).format('YYYY/MM/DD HH:mm:ss')
  );
  var rootURL = __meteor_runtime_config__.ROOT_URL;
  console.log('%s Mode is running.', rootURL);
  Meteor.methods({
    "create_message":function (msg) {
      if (!!msg.message) {
        var row = {
          userName:msg.user.profile.name,
          message:msg.message,
          createTime:Date.now(),
          myBoo : 0
        };
        if (msg.page) {
          row.page = msg.page;
        }
        return Messages.insert(row);
      }
      return null;
    },
    "getServerStartTime":function () {
      return Date.now();
    },
    "getCount":function (page) {
      return Messages.find(page ? {'page':page} : {}).count();
    },
    "setMyBoo":function (msg){
      return Messages.update({_id:msg.rowid},{$inc:{myBoo:1}});
    }
  });

  /* Meteor.accounts -> Accounts 로 변경 */
  Accounts.configuration.remove({});
  for (var conf in config) {
    if (conf === rootURL) {
      config[conf].services.forEach(function (service) {
        console.dir(service);
        Accounts.configuration.insert(service);
      });
    }
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
