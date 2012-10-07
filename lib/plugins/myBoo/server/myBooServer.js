Meteor.startup(function () {
  Meteor.methods({
    "setMyBoo":function (arg) {
      var msg = Messages.findOne({_id:arg.id});
      var user = arg.user;
      msg.myBoo = msg.myBoo || [];
      var index = -1;
      if (!msg.myBoo.some(function (s) {
        index++;
        return user._id === s._id
      })) {
        msg.myBoo.push(user);
      } else {
        msg.myBoo.splice(index, 1);
      }
      return Messages.update({_id:msg._id}, msg);
    }
  });
});
