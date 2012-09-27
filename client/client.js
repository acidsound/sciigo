Template.head.uptime = function () {
  return moment().format('YYYY/MM/DD hh:mm:ss');
};

Template.head.ROOT_URL = function() {
  return __meteor_runtime_config__.ROOT_URL;
};

Template.main.messages = function () {
  return Messages.find({},{sort:{createTime:-1}}).map(function (message) {
    if (Meteor.user()) {
      message.userType = message.userName === Meteor.user().profile.name ? 'success' : '';
      message.timeAgo=moment(message.createTime).fromNow();
    }
    return message;
  });
}

Template.main.loginUser = function () {
  return Meteor.user() && Meteor.user().profile ? Meteor.user().profile.name : '';
}

Template.formMessage.userName = function () {
  return Meteor.user() && Meteor.user().profile ? Meteor.user().profile.name : '';
}

// salt for preserve input element
Template.formMessage.preserve({
  'input[id]': function (node) {
    return node.id;
  }
});

Template.formMessage.events = {
  'submit':function () {
    Messages.insert({
      userName:Meteor.user().profile.name,
      message:$('input#inputMessage').val()
    });
    $('input#inputMessage').val('').focus();
  }
}
Session.set('count', 0);
