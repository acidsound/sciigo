spellcheckor
=============
한국어 맞춤법 검사 플러그인
### 사용방법
1. /lib/plugins/ 폴더 아래 해당 기능을 복사한다.
1. client side - 해당 이벤트에서 spellCheck 를 call. 인자는 맞춤법을 검사할 값이고 리턴값으로 맞춤법이 틀렸을 경우에 올바르게 수정한 결과를 반환한다.

```javascript
Meteor.call('spellCheck', $('input#inputMessage').val(), function(err,result) {
  if (!err) {
    if (!result.modified) {
      $("#checkResult").removeClass('hidden');
    }
  }
});
```
