Handlebars.registerHelper('count', function (array) {
  return typeof array === 'object' ? (array.length ? array.length : '') : '';
});
