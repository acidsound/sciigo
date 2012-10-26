Handlebars.registerHelper('autoLink', function (text) {
  var uriExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  return /<.*?>/gi.test(text) ? text : text.replace(uriExp, function (match) {
    return '<a href="' +
      (/[a-z-]+:\/\//gi.test(match) ? '' : 'http://') + match +
      '" target="_blank">' + match + '</a>';
  });
});