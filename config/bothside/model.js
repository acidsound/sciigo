// 공통으로 들어가야 하기 때문에 우선 순위가 높으려면 깊은 depth에 넣어야함.
var Messages = new Meteor.Collection("messages");
var ServerTime = new Meteor.Collection("serverTime");

Meteor.methods({
  "create_message":function (msg) {
    if (!!msg.message) {
      var row = {
        user:msg.user,
        message:msg.message,
        createTime:Date.now()
      };
      if (msg.page) {
        row.page = msg.page;
      }
      return Messages.insert(row);
    }
    return null;
  }
});