countHelper Plugin
=============
array 의 배열의 갯수를 표시하는 Handlebar 용 helper plugin

### 사용방법
1. /lib/plugins/ 폴더 아래 해당 기능을 복사한다.
1. template 중 필요한 부분에 {{count object}}형태로 사용한다.

```html
<span class="myBoo pull-right">{{count myBoo}}<i class="icon-thumbs-down"></i></span>
```

### 특이사항
1. array 의 길이가 0 일때 ''을 반환한다. 만일 0을 사용하고자 한다면 {{#if count array}} 조합을 사용한다.