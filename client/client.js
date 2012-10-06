Template.head.events = {
  'click .brand':function () {
    Router.setPage('');
    Router.setMenu('');
  },
  'click .about':function () {
    Router.setMenu('about');
  },
  'click .home':function () {
    Router.setMenu('');
  }
};

Template.main.startTime = function () {
  var stime;
  try {
    stime = ServerTime.findOne();
  } catch (e) {
    // IEFix
    // TODO : 서버 타임은 아무래도 이대론 안된다고 봄
    stime.startTime = Date.now();
  }
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
    'page/:page':'getPage',
    ':menu':'getMenu'
  },
  getPage:function (page) {
    page = !page ? '' : page;
    if (!Session.equals('page', decodeURIComponent(page))) {
      Session.set('page', decodeURIComponent(page));
    }
    if (!page) {
      Session.set('menu', '');
    }
  },
  setPage:function (page) {
    Session.set('page', page);
    this.navigate(page ? '/page/' + page : '', true);
    backToTop();
  },
  getMenu:function (menu) {
    menu = menu ? menu : '';
    Session.set('menu', menu);
  },
  setMenu:function (menu) {
    Session.set('menu', menu);
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

Handlebars.registerHelper('menu', function () {
  return Session.get('menu');
});

Handlebars.registerHelper('isLogin', function () {
  return Meteor.user() && Meteor.user().profile;
});

/* automap click event to touchstart */
for (tpl in Template) {
  var obj = Template[tpl];
  if (obj.events && (typeof obj.events === 'object')) {
    for (event in obj.events) {
      try {
        var args = event.split(' ');
        if (args[0] === 'click') {
          args[0] = 'touchend';
          obj.events[args.join(' ')] = obj.events[event];
        }
      } catch (e) {
        // IE Fix : in split
      }
    }
  }
}