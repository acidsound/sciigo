Meteor.startup(function () {
  Meteor.methods({
    "spellCheck":function (context) {
      var fut = new Future();

      var spellURL = 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201209/lib/PnuSpellerISAPI_201209.dll?Check';
      var reqURL = spellURL + '&text1=' + encodeURIComponent(context);
      Meteor.http.get(reqURL, {}, function (err, result) {
        if (!err) {
          var modstr = result.content.match(/id='bufUnderline2'[^>]*>([^<]*)/gi)[0].replace(/id='bufUnderline2'[^>]*>/gi, '');
          fut.ret({modified:modstr});
        } else {
          fut.ret({modified:''});
        }
      });
      return fut.wait();
    }
  });
});



