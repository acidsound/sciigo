Handlebars.registerHelper('timeAgo', function (time) {
  return moment(time).fromNow();
});