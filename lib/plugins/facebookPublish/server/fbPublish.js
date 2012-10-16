// https://developers.facebook.com/docs/opengraph/tutorial/
Meteor.methods({
  'fbGetList':function () {
    var user = Meteor.user();
    if (user && user.services.facebook) {
      var accessToken = user.services.facebook.accessToken;
      var url = 'https://graph.facebook.com/me/sciigo_meteor:chat?access_token=' + accessToken;
      Meteor.http.get(url, function (err, result) {
        if (!err) {
          console.log(result.content);
        }
      });
    }
  },
  'fbPublish':function () {
    console.log('fbPublish-start');
    var user = Meteor.user();
    if (user && user.services.facebook) {
      var accessToken = user.services.facebook.accessToken;
      var url = 'https://graph.facebook.com/me/sciigo_meteor:chat?access_token=' + accessToken;
      Meteor.http.post(url, {
//        access_token:accessToken,
        sciigo:__meteor_runtime_config__.ROOT_URL
      }, function (err, result) {
        if (!err) {
          console.log(result.content);
        } else {
          console.log(accessToken, err, result);
        }
      });
    }
  },
  'fbDelete':function (id) {
    var user = Meteor.user();
    if (user && user.services.facebook) {
      var accessToken = user.services.facebook.accessToken;
      var url = 'https://graph.facebook.com/' + id;
      Meteor.http.del(url, {
        access_token:accessToken
      }, function (err, result) {
        if (!err) {
          console.log(result.content);
        }
      });
    }
  }
});