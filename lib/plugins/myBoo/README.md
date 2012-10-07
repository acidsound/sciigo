myBoo Plugin
=============
"싫어요(Boo~)" 기능 확장

### 사용방법
1. /lib/plugins/ 폴더 아래 해당 기능을 복사한다.
1. client side - 해당 이벤트에서 setMyBoo 를 call. 인자는 boo를 적용할 항목의 _id 와 boo를 한 사람의 유저정보를 넘겨준다.

```javascript
  'click .myBoo':function () {
    Meteor.call("setMyBoo", {id:this._id, user:Meteor.user()});
  }
```
1. template 을 수정하여 표시되도록 만든다.

```html
<span class="myBoo pull-right">{{count myBoo}}<i class="icon-thumbs-down"></i></span>
```