Handlebars.registerHelper('timeAgo', function (time) {
  return moment(time).fromNow();
});

Meteor.startup(function () {
  Meteor.setInterval(function () {
    Meteor.call('updateTimeAgo');
  }, 10000);
});

Meteor.methods({
  'updateTimeAgo':function () {
    if (this.isSimulation) {
      Messages.find().forEach(function (v) {
        Messages.update(v._id, v);
      });
    }
  }
});