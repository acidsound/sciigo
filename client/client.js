Template.head.events = {
  'click .brand':function () {
    Router.setPage('');
  },
  'click .about' : function(){
      $('.about').addClass('active');
      $('.home').removeClass('active');
      $('.homePage').hide();
      $('.aboutPage').show();
  },
  'click .home' : function(){
      $('.home').addClass('active');
      $('.about').removeClass('active');
      $('.aboutPage').hide();
      $('.homePage').show();
  }
};

Template.main.startTime = function () {
  var stime = ServerTime.findOne();
  return stime ? moment(stime.startTime).format('YYYY/MM/DD HH:mm:ss') : '';
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

Template.main.rendered = function () {
  $('article ul li').removeClass('hidden').each(function (k, v) {
    Meteor.setTimeout(function () {
      $(v).removeClass('future');
    }, 30 * k);
  })
}

Template.main.events = {
  'click .page':function () {
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
      Meteor.call("create_message", message);
    }
    messageBox.val('').focus();
  }
};

var loginWithFacebook = function () {
  Meteor.loginWithFacebook();
};

var logout = function () {
  Meteor.logout();
};

backToTop = function () {
  $('body,html').animate({scrollTop:0}, 400, 'swing');
}

Template.login.events = {
  'click #logout':logout,
  'click #loginFB':loginWithFacebook
};

/* subscribe */
Meteor.autosubscribe(function () {
  Meteor.subscribe('messages', Session.get('page'));
  Meteor.subscribe('serverTime');
});

/* backbone router */
var sciigoRouter = Backbone.Router.extend({
  routes:{
    '':'getPage',
    'page/:page':'getPage'
  },
  getPage:function (page) {
    page = !page ? '' : page;
    if (!Session.equals('page', decodeURIComponent(page))) {
      Session.set('page', decodeURIComponent(page));
    }
  },
  setPage:function (page) {
    Session.set('page', page);
    this.navigate(page ? '/page/' + page : '', true);
    backToTop();
  }
});

Router = new sciigoRouter();
Meteor.startup(function () {
  Backbone.history.start({pushState:true});
});

/* helpers */
Handlebars.registerHelper('pageName', function () {
  return Session.get('page');
});

Handlebars.registerHelper('isLogin', function () {
  return Meteor.user() && Meteor.user().profile;
});

/* automap click event to touchstart */
for (tpl in Template) {
  var obj = Template[tpl];
  if (obj.events && (typeof obj.events === 'object')) {
    for (event in obj.events) {
      var args = event.split(' ');
      if (args[0] === 'click') {
        args[0] = 'touchend';
        obj.events[args.join(' ')] = obj.events[event];
      }
    }
  }
}