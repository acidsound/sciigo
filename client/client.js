var PAGE_LIMIT = 30;
Meteor.startup(function () {
  Session.set('limit', PAGE_LIMIT);
});

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

Template.main.messages = function () {
  msg = Messages.find({}, {sort:{createTime:-1}}).fetch();
  return _.map(msg.slice(0, Session.get('limit')), function (message) {
    if (Meteor.user()) {
      if (message.user) {
        message.userType = message.user._id === Meteor.user()._id ? 'success' : '';
      }
    }
    return message;
  });
};

Template.main.hasMore = function () {
  return Session.get('limit') < Messages.find().count();
};

Template.main.rendered = function () {
  $('article ul li').removeClass('hidden').each(function (k, v) {
    Meteor.setTimeout(function () {
      $(v).removeClass('future');
    }, 10 * k);
  })
};

Template.main.events = {
  'click .page':function () {
    Router.setPage(this.page);
  },
  'click #more':function () {
    Session.set('limit', Session.get('limit') + PAGE_LIMIT);
  },
  'click .myBoo':function () {
    if (Meteor.user()) {
      Meteor.call("setMyBoo", {id:this._id, user:Meteor.user()});
    }
  },
  'click .timeago':function () {
    Router.setPost(this._id);
  }
};

Template.about.startTime = function () {
  var stime = {startTime:0};
  try {
    stime = ServerTime.findOne();
  } catch (e) {
    // IEFix
    // TODO : 서버 타임은 아무래도 이대론 안된다고 봄
    stime.startTime = Date.now();
  }
  return stime ? moment(stime.startTime).format('YYYY/MM/DD HH:mm:ss') : '';
};

Template.about.ROOT_URL = function () {
  return __meteor_runtime_config__.ROOT_URL;
};

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
  },
  'click #spellcheckor':function () {
    $("#checkResult").removeClass('hidden').addClass('hidden');
    Meteor.call('spellCheck', $('input#inputMessage').val(), function (err, result) {
      if (!err) {
        if (result.modified) {
          $('input#inputMessage').val(result.modified).focus();
        } else {
          $("#checkResult").removeClass('hidden');
        }
      }
    });
  }
};

// postDetail
Template.postDetail.messages = function () {
  return Messages.findOne({_id:Session.get('postId')});
};

Template.postDetail.events = Template.main.events;

var loginWithFacebook = function () {
  Meteor.loginWithFacebook(ServiceConfiguration.facebook);
};

var logout = function () {
  Meteor.logout();
};

backToTop = function () {
  $('body,html').animate({scrollTop:0}, 400, 'swing');
};

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
    'post/:post':'getPost',
    ':menu':'getMenu'
  },
  getPage:function (page) {
    Session.set('limit', PAGE_LIMIT);
    page = !page ? '' : page;
    if (!Session.equals('page', decodeURIComponent(page))) {
      Session.set('page', decodeURIComponent(page));
    }
    if (!page) {
      Session.set('menu', '');
    }
  },
  setPage:function (page) {
    this.getPage(page);
    this.navigate(page ? '/page/' + page : '', true);
    backToTop();
  },
  getMenu:function (menu) {
    menu = menu ? menu : '';
    Session.set('menu', menu);
  },
  setMenu:function (menu) {
    this.getMenu(menu);
    this.navigate('/' + menu);
  },
  getPost:function (postId) {
    Session.set('menu', 'postDetail');
    Session.set('postId', postId);
  },
  setPost:function (postId) {
    this.getPost(postId);
    this.navigate('/post/' + postId);
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

Handlebars.registerHelper('menu', function () {
  return Session.get('menu');
});

Handlebars.registerHelper('isMenu', function (menu) {
  return Session.equals('menu', menu);
});

Handlebars.registerHelper('isLogin', function () {
  return Meteor.user() && Meteor.user().profile;
});

/* automap click event to touchstart */
_.each(Template, function (obj) {
  if (obj.events && (typeof obj.events === 'object')) {
    _.each(obj.events, function (value, key) {
      try {
        var args = key.split(/ /);
        if (args[0] === 'click') {
          args[0] = 'touchend';
          obj.events[args.join(' ')] = value;
        }
      } catch (e) {
        // IE Fix : in split
      }
    });
  }
});