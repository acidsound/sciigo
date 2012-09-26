Template.hello.greeting = function () {
  return "세미나에 어서오세요. 제발  " + Session.get('count') + "번만요";
};
Template.hello.uptime = function () {
  return moment().format("YYYY/MM/DD hh:mm:ss");
};
Template.hello.messages = function () {
  return Messages.find({},{sort:{createTime:-1}}).map(function (message) {
    if (Meteor.user()) {
      message.userType = message.userName === Meteor.user().profile.name ? "success" : "";
      message.timeAgo=moment(message.createTime).fromNow();
    }
    return message;
  });
}

Template.hello.loginUser = function () {
  return Meteor.user() && Meteor.user().profile ? Meteor.user().profile.name : "";
}

Template.formMessage.userName = function () {
  return Meteor.user() && Meteor.user().profile ? Meteor.user().profile.name : "";
}

Template.formMessage.events = {
  "submit":function () {
    console.log('submitted');
    Messages.insert({
      userName:Meteor.user().profile.name,
      message:$("input#inputMessage").val(),
      createTime: Date.now()
    });
    $("input#inputMessage").val('').focus();
  }
}
Session.set('count', 0);
