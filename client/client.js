Template.head.events = {
  'click .brand': function() {
    Router.setPage('');
  }
};

Template.main.startTime = function () {
  return window.startTime;
};

Template.main.ROOT_URL = function () {
  return __meteor_runtime_config__.ROOT_URL;
};

Template.main.messages = function () {
  return Messages.find({}, {sort:{createTime:-1}}).map(function (message) {
    if (Meteor.user()) {
      message.userType = message.userName === Meteor.user().profile.name ? 'success' : '';
    }
    message.timeAgo = moment(message.createTime).fromNow();
    return message;
  });
};

Template.main.events = {
  'click .page': function() {
    Router.setPage(this.page);
  }
};

// salt for preserve input element
Template.formMessage.preserve({
  'input[id]':function (node) {
    return node.id;
  }
});

Template.formMessage.events = {
  'submit':function () {
    var messageBox = $('input#inputMessage');
    if (messageBox.val()) {
      var message = {
        'user':Meteor.user(),
        'message':messageBox.val()
      };
      page = Session.get('page');
      if (page) {
        message.page = page;
      }
      Meteor.call("create_message", message, function (error, messageId) {
        if (!error) $('input#inputMessage').val('').focus();
      });
    }
  }
};

var loginWithFacebook = function () {
  Meteor.loginWithFacebook();
};

var logout = function () {
  Meteor.logout();
};

backToTop = function() {
  $('body,html').animate({scrollTop:0}, 400, 'swing');
}

Template.login.events = {
  'click #logout':logout,
  'touchend #logout':logout,
  'click #loginFB':loginWithFacebook,
  'touchend #loginFB':loginWithFacebook
};

/* subscribe */
Meteor.autosubscribe(function () {
  Meteor.subscribe('messages', Session.get('page'));
});

/* backbone router */
var sciigoRouter = Backbone.Router.extend({
  routes:{
    '':'main',
    'page/:page':'getPage'
  },
  main:function () {
    Session.set('page', '');
  },
  getPage:function (page) {
    Session.set('page', decodeURIComponent(page));
  },
  setPage:function (page) {
    Session.set('page', page);
    this.navigate(page ? '/page/'+page : '', true);
    backToTop();
  }
});

Router = new sciigoRouter();
Meteor.startup(function () {
  Backbone.history.start({pushState:true});

  Meteor.call("getServerStartTime", function (error, startTime) {
    if (!error)
      console.log(startTime, !error);
    /* global variable */
    window.startTime = moment(startTime).format('YYYY/MM/DD hh:mm:ss');
  });

});

/* helpers */
Handlebars.registerHelper('pageName', function() {
  return Session.get('page');
});

Handlebars.registerHelper('isLogin', function() {
  return Meteor.user() && Meteor.user().profile;
});
