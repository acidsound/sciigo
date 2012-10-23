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
      Messages.update({}, {$unset:{_nothing:1}}, {multi:true});
    }
  }
});