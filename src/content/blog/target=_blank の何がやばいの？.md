---
title: "target=_blank の何がやばいの？"
id: rjfiqad
public: false
publishedAt: 2023-12-13
editedAt: null
description: "この記事は HTMLのaタグに付与する属性である target=\"blank\" に脆弱性がある と記事などはちょいちょい見ていたけど、実際に何がそんなにやばいのかについてしっかり理解できていなかったの"
tags:
  - JavaScript
  - プログラミング
---


# この記事は

HTMLのaタグに付与する属性である **target="_blank" **に脆弱性がある

と記事などはちょいちょい見ていたけど、実際に何がそんなにやばいのかについてしっかり理解できていなかったのでまとめてみる。

## 先に結論

**target="_blank" **を指定した場合、ブラウザが勝手によしなにしてくれるようになっているようで、

## そもそも**target="_blank"とは**

**target="_blank" **って何をするの？ という話です。とりあえずtarget属性とは何かから理解します。

> [`target`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a#target)
> リンク先の URL を表示する場所、*閲覧コンテキスト*（タブ、ウィンドウ、[`<iframe>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/iframe)）の名前で指定します。以下のキーワードは URL の読み込み先について特別な意味を持ちます。
> 
> 
> • `_self`: 現在の閲覧コンテキストです。（既定値）
> • `_blank`: ふつうは新しいタブですが、新しいウィンドウを使用するようにブラウザーを設定できます。
> • `_parent`: 現在の親の閲覧コンテキストです。親がない場合は、 `_self` と同じ振る舞いをします。
> • `_top`: 最上位の閲覧コンテキスト（現在のコンテキストの祖先である "最上位" のコンテキスト）です。親の閲覧コンテキストがない場合は、 `_self` と同じ動作をします。
> 
> **メモ:** `target="_blank"` を `<a>` 要素に設定すると、暗黙的に `rel` の動作は [`rel="noopener"`](https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel/noopener) が設定されたかのように動作し、 `window.opener` を設定しません。

[https://developer.mozilla.org/ja/docs/Web/HTML/Element/a#属性](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a#属性)

- target = リンク先のURLを表示する場所を指定するための属性
- _blank = 新しい名前なしのウィンドウを使用するように指定するための値

aタグのhrefに指定したURLがどうやって開くかを指定するためのもので、設定しなければデフォルト値である**target=”_self” **が設定される。これはそのまま今開いているブラウザのタブで開くという設定値。

”_blank”で指定している部分は、**target=”hoge” **などといった形で指定することも可能。

これはブラウジング・コンテキスト（開いているタブやiframeタグなど）の名前を「hoge」という名前で指定して開くことができるということで、例えば一度別タブで「hoge」という名前のタブが開かれた状態で、もう1回同じリンクをクリックすると新規タブは開かれずにさっき開いた「hoge」という名前のタブに移動する。

[https://www.osaka-kyoiku.ac.jp/~joho/html5_ref/target_attr.php](https://www.osaka-kyoiku.ac.jp/~joho/html5_ref/target_attr.php)

[https://developer.mozilla.org/ja/docs/Glossary/Browsing_context](https://developer.mozilla.org/ja/docs/Glossary/Browsing_context)

## 脆弱性について

遷移元のページAから外部リンクのページBを開くとします。`target="_blank”` で開かれた新規タブのページBでは、遷移元のページAを`window.opener`オブジェクトとして参照することができます。

つまり、親ウィンドウのオブジェクトにアクセスしたり、 window.opener.location = newURL によって親ページの URL を変更したりできます。

つまり、指定した外部サイトが悪意のあるサイトだった場合、JavaScriptでページAのいろんな情報を書き換えられたりとやりたい放題されてしまいます。

なので、target=”_blank” を指定する場合は必ず `rel=”noopener noreferrer”` をつけましょう。これは新規で開かれたページBから、ページAの情報を参照できないようにする属性です。

### noopenerとは

### noreferreとは


[https://www.mizdra.net/entry/2020/10/28/234533](https://www.mizdra.net/entry/2020/10/28/234533)