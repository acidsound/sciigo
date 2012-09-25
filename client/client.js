Template.hello.greeting = function () {
  return "세미나에 어서오세요. 제발  "+ Session.get('count')+"번만요";
};
Template.hello.uptime = function() {
  return moment().format("YYYY/MM/DD hh:mm:ss");
};

Template.hello.events = {
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
      Session.set("count", Session.get('count')+1)
  }
};

Template.hello.messages = function() {
	return Messages.find().map(function(user) {
		if (Meteor.user()) {
			user.userType = user.userName === Meteor.user().profile.name ? "success":"";
		}
		return user;
	});
}
Session.set('count', 0);
