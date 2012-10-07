Meteor.startup(function () {
  var jsdom = require(modulePath + '/jsdom');
  Meteor.methods({
    "spellCheck":function (context) {
      var fut = new Future();

      var spellURL = 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201209/lib/PnuSpellerISAPI_201209.dll?Check';
      var reqURL = spellURL + '&text1=' + encodeURIComponent(context);
      jsdom.env(reqURL, {
        done:function (err, window) {
          fut.ret({
            "modified":window.document.getElementById('bufUnderline2').innerHTML
          });
        }
      });
      return fut.wait();
    }
  });
});



