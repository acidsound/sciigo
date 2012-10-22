Handlebars.registerHelper('timeAgo', function (time) {
  return moment(time).fromNow();
});

Meteor.startup(function () {
  Meteor.setInterval(function () {
    Meteor.call('updateTimeAgo');
  }, 30000);
});

Meteor.methods({
  'updateTimeAgo':function () {
    if (this.isSimulation) {
      Messages.find().forEach(function (v) {
        Messages.update(v._id, {$set:{createTime:v.createTime}});
      });
    }
  }
});