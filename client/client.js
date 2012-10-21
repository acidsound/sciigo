var PAGE_LIMIT = 30;
Meteor.startup(function () {
  Session.set('limit', PAGE_LIMIT);
});

Template.head.events = {
  'click .brand':function () {
    Router.getPage('');
    Router.getMenu('');
  },
  'click .about':function () {
    Router.getMenu('about');
  },
  'click .home':function () {
    Router.getMenu('');
  }
};

Template.main.messages = function () {
  msg = Messages.find({}, {sort:{createTime:-1}}).fetch();
  return msg.slice(0, Session.get('limit'));
};

Template.main.hasMore = function () {
  return Session.get('limit') < Messages.find().count();
};

//Template.main.rendered = function () {
//  $('article ul li').removeClass('hidden').each(function (k, v) {
//    Meteor.setTimeout(function () {
//      $(v).removeClass('future');
//    }, 10 * k);
//  })
//};

Template.main.events = {
  'click #more':function () {
    Session.set('limit', Session.get('limit') + PAGE_LIMIT);
  }
};

Template.post.events = {
  'click .page':function () {
    Router.getPage(this.page);
  },
  'click .myBoo':function () {
    if (Meteor.user()) {
      Meteor.call("setMyBoo", {id:this._id, user:Meteor.user()});
    }
  },
  'click .timeago':function () {
    Router.getPost(this._id);
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

Template.postDetail.messages = function () {
  return Messages.findOne({_id:Session.get('postId')});
};

var afterLoginCallback = function (err) {
  if (err) {
  } else {
    Meteor.call('afterLogin', function (err, result) {
      if (result) {
        Session.set('alert', result + ' 는 다른 사용자가 사용하고 있습니다.<br/>사용자명은 따로 Profile에서 수정하실 수 있습니다.');
      }
    });
  }
};

Template.alert.event = {
  'click button':function () {
    Session.set('alert', '');
  }
};

var loginWithFacebook = function () {
  Meteor.loginWithFacebook(ServiceConfiguration.facebook, afterLoginCallback);
};

var logout = function () {
  Meteor.logout();
};

backToTop = function () {
  $('body,html').animate({scrollTop:0}, 400, 'swing');
};

Template.login.events = {
  'click #logout':logout,
  'click #profile':function () {
    Router.getPage(Meteor.user().profile.displayName);
  },
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
    Session.set('menu', '');
    page = !page ? '' : page;
    if (!Session.equals('page', decodeURIComponent(page))) {
      Session.set('page', decodeURIComponent(page));
    }
    this.navigate(page ? '/page/' + page : '', true);
    backToTop();
  },
  getMenu:function (menu) {
    menu = menu ? menu : '';
    Session.set('menu', menu);
    this.navigate('/' + menu);
  },
  getPost:function (postId) {
    Session.set('menu', 'postDetail');
    Session.set('postId', postId);
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

Handlebars.registerHelper('alert', function () {
  return Session.get('alert');
});

Handlebars.registerHelper('userType', function () {
  return Meteor.user() && Meteor.user().profile && this.user && (this.user._id === Meteor.user()._id) ? 'success' : '';
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