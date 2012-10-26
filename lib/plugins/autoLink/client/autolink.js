Handlebars.registerHelper('autoLink', function (text) {
  var uriExp = /^(<)*[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
  console.log(text);
  return text.replace(uriExp, function (match) {
    return '<a href="' + match + '" target="_blank">' + match + '</a>';
  });
});