---
title: "オリジンとSOP（同一オリジンポリシー）について理解する"
id: t38go30
public: true
publishedAt: 2023-06-24
editedAt: null
description: "この記事について CORS（Cross-Origin Resource Sharing）について完全に理解しようと思って記事を書き始めたのですが、CORSの前提でまず理解しなければいけない「オリジン」"
tags:
  - Web
  - ブラウザ
---


# この記事について

CORS（Cross-Origin Resource Sharing）について完全に理解しようと思って記事を書き始めたのですが、CORSの前提でまず理解しなければいけない「オリジン」の意味だったりSOP（同一オリジンポリシー）について掘り下げているうちにめちゃくちゃ長くなってきました。

そのため、この記事ではオリジンやそれらにまつわる言葉の意味についてと、同一オリジンポリシーがどのようなもので、どういった制約を課しているのかを記述していきます。

CORSについては次の記事でまとめていきます。

## オリジンとは？

というわけで、まずはOrigin（オリジン）から

> ウェブコンテンツの**オリジン** (Origin) は、ウェブコンテンツにアクセスするために使われる [URL](https://developer.mozilla.org/ja/docs/Glossary/URL) の *スキーム* （プロトコル）、 *ホスト* （ドメイン）、 *ポート番号* によって定義されます。スキーム、ホスト、ポート番号がすべて一致した場合のみ、 2 つのオブジェクトは同じオリジンであると言えます。

引用

[https://developer.mozilla.org/ja/docs/Glossary/Origin](https://developer.mozilla.org/ja/docs/Glossary/Origin)

引用の通りですが、URLには「スキーム（プロトコル）」「ホスト（ドメイン）」「ポート」という要素があり、これら3つの組み合わせが**「オリジン」**と呼ばれているようです。

## ドメインとの違い

オリジンがURLのことを指しているというのは文面から何となく理解できましたが、「ドメイン」とはどういった違いがあるの？ ということが気になりました。

結論から言うと、オリジンとドメインは指しているものが以下のように違います。

- ドメイン（Domain）: uenishi.blog
- オリジン（Origin）: https://www.uenishi.blog:443

ドメインはオリジンの中の一部「uenishi.blog」を指しており、オリジンはプロトコル「https」とホスト（ドメイン）「www.uenishi.blog」、ポート番号「443」まで含んだものを指している、という点です。


### httpsとは

> ハイパーテキストトランスファープロトコル・セキュア（HTTPS）は、WebブラウザとWebサイト間でデータを送信するために使用される主要なプロトコルである[HTTP](https://www.cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/)のセキュアバージョンです。HTTPSは、データ転送のセキュリティを強化するために暗号化されます。

[https://www.cloudflare.com/ja-jp/learning/ssl/what-is-https/](https://www.cloudflare.com/ja-jp/learning/ssl/what-is-https/)

### ポート番号 443

HTTPSで使用されるポート番号。

ポート番号はコンピュータで実際に通信される出入口の番号のこと。各通信プロトコルによって番号が定められており、HTTPSでのやり取りは**443番ポート**を用いるように定められています。

HTTPでのやり取りは80番ポート、FTPは20・21番など、それぞれのプロトコルによって予約されており、それを「ウェルウンポート」と呼びます。

ポート番号は省略することができ、省略した場合は先頭で指定したプロトコルに対応したポート番号が使われます（HTTPSであれば、443とわざわざURLに打たずとも、ポート番号443が使用される）。

[https://jp.globalsign.com/support/ssl/certificates/about-portno.html](https://jp.globalsign.com/support/ssl/certificates/about-portno.html)


URLの全体像についての図解は、以下が参考になったため引用させていただきます。

![](_images/Untitled%2012.png)

引用

[https://shukapin.com/infographicIT/origin-policy](https://shukapin.com/infographicIT/origin-policy)

### FQDN (Fully Qualified Domain Name)

ここは補足的な掘り下げになります。

MDNの引用より「ホスト（ドメイン）」と書いていた際、ホスト = ドメインのような印象を受けたので、改めて調べてみました。

厳密には全く別で、上記の図の通り、ホスト（www）とドメイン（aaa.com）を合わせてFQDNと呼ぶようです。

FQDNはFully Qualified Domain Nameの略で、「完全修飾ドメイン名」と訳されます。

今回、このあたりは掘り下げすぎず、端的にまとめます。

- FQDN
    - ホスト名とドメイン名のこと。省略できるものを全部ちゃんと書いた形
- ホスト名
    - ドメイン名の前に . で区切ってある。www.domain.comやnote.domain.com など（省略可能な場合もある）
- ドメイン名
    - インターネット上での「住所」に相当する。ドメインは重複登録できず、世界中に一つしか存在しないため、基本的には早いもの勝ち。

## クロスオリジンと同一オリジン

「オリジン」が何を指しているのかがはっきりしてきたところで、「クロスオリジン」という言葉に着目して掘り下げていこうと思います。

開いているWebページに対して、

- 異なるオリジン：クロスオリジン
- 同じリソース：同一オリジン

といい、オリジンを境界としてリソースの保護範囲を決定する取り決めを「同一オリジンポリシー（Same-Origin Policy）」と呼びます。

例として

1. http://www.example.jp/index.html
2. http://www.example.jp:80/index.ts
3. https://www.example.jp/index.html
4. http://www.example.com/index.js

上記の例では、1と2は

- スキーム → http://
- ホスト → www.example.jp
- ポート → 80 (1は省略されている)

であり、「同一オリジン」といえます。

その他1と3 & 4、2と3 & 4はオリジンが異なっており、1, 2から見るとそれぞれ「クロスオリジン」であるといえます。

## 同一オリジンポリシー（Same-Origin Policy）

「同一生成元ポリシー」や「同一源泉ポリシー」というような呼ばれ方もしますが、実際に指す意味合いとしては同じものです。

ブラウザに実装されている仕組みで、主にCSRF（クロスサイトリクエストフォージェリ）やXSS（クロスサイトスクリプティング）などといった攻撃を防止するためのものです。

具体的にはWebページなどで、異なるオリジンのリソースにアクセスできないよう制限します。

例えば以下のような場合

![](_images/Untitled%2013.png)

ネットサーフィンを楽しんでいるユーザーが、WebページAを開いている最中、ユーザーのローカルストレージになんらかの情報が保存されたとします。

そしてWebページAの次にアクセスしたサイトが悪意のあるサイトだった場合、サイトがローカルストレージにアクセスし、先ほどのデータをサーバーへ送信されるかもしれません。

このような攻撃を避けるために、あるWebリソースから別のWebリソースに対する操作には、なんらかの制限が必要になってきます。

しかし、全てのWebリソース間の操作に対して制限をかけてしまうと、Webの自由度や利便性が著しく下がってしまいます。そのため、Webブラウザは最低限、セキュリティが担保できる範囲内での制限にとどめています。

あるリソースから別のリソースに対して操作を行う時、以下の3つに分類できます。

5. ブラウザ内アクセス
6. ネットワーク越しのアクセス
7. 埋め込み

これらを表にまとめると、以下になります。

| 操作 | 制限 |
| --- | --- |
| ブラウザ内アクセス | ほぼ禁止されている |
| ネットワーク越しのアクセス | 単純リクエストのみ許可。それ以外は制限される |
| 埋め込み | 制限なし |

### ブラウザ内アクセス

ウィンドウへの参照を経由したDOMの操作など

例えば、以下のようなコードの場合。

```html
<script>
  window.addEventListener("load", () => {
    alert(window.frame01.contentWindow.secret.innerHTML == "THIS IS A SECRET MESSAGE");
    alert(window.frame02.contentWindow.secret.innerHTML == "THIS IS A SECRET MESSAGE");
  });
</script>
<iframe id="frame01" src="http://localhost:10000/chapter02/resource.html"></iframe>
<iframe id="frame02" src="http://localhost:20000/chapter02/resource.html"></iframe>
```

http://localhost:10000/chapter02/read.htmlにあるファイルにアクセスした場合。

iframeで異なるOrigin（http://localhost:20000）のWebページにアクセスして、DOMを書き換えようとしています。

異なるOriginのリソースを書き換えてしまえたら、他のWebサイトを改ざんできてしまうこととなるため、これは妥当な制限と言えます。

エラー内容

```javascript
Uncaught DOMException: Blocked a frame with origin "http://localhost:10000" from accessing a cross-origin frame.
    at http://localhost:10000/chapter02/read.html:4:40
```

また、http://localhost:20000 のリソースがFetch APIなどで取得したデータ（レスポンス）に関しても、http://localhost:10000から読み出したりすることは制限がされます。

### ネットワーク越しのアクセス

<a>、<form>などのHTMLタグにによるリクエストは「単純リクエスト」とされ、制限の対象にはなっていません。

その一方で、Fetch APIなどはカスタムヘッダ付きのリクエストとなり、自由度が高いことから制限が課されています。

具体例としては、以下のようなコードの場合

```html
<form id="form01" action="http://localhost:10000/chapter02/resource.html">
  <input type="hidden" name="test" value="test">
  <input type="submit">
</form>
<form id="form02" action="http://localhost:20000/chapter02/resource.html">
  <input type="hidden" name="test" value="test">
  <input type="submit">
</form>
  
<p id="result01"></p>
<p id="result02"></p>
<script>
  fetch("http://localhost:10000/chapter02/resource.html", { headers: { "X-CUSTOM-HEADER": "value" } }).then(() => {
    document.getElementById("result01").innerText = "#1 succeeded.";
  }).catch(() => {
    document.getElementById("result01").innerText = "#1 failed.";
  });
  fetch("http://localhost:20000/chapter02/resource.html", { headers: { "X-CUSTOM-HEADER": "value" } }).then(() => {
    document.getElementById("result02").innerText = "#2 succeeded.";
  }).catch(() => {
    document.getElementById("result02").innerText = "#2 failed.";
  });
</script>
```

http://localhost:10000/chapter02/write.html にアクセスすると、以下のような画面が表示されます。

![](_images/Untitled%2014.png)

まず、scriptタグ内のfetchで http://localhost:10000 と http://localhost:20000のリソースにアクセスしています。そしてそれぞれの結果に従ってresult01, result02のテキストを書き換えていますが、http://localhost:20000へのfetchはエラーとなり、「#2 failed.」がDOMに描画されています。

以下は開発者ツールでの出力結果です。

console

![](_images/Untitled%2015.png)

Network

https://localhost:20000へのアクセスに対して、「CORS error」が表示されています。

![](_images/Untitled%2016.png)

次に、formタグ、aタグでのリクエストですが、こちらを試してみます。

わかりやすくするために、上のコードを以下のように書き換えてみました。

```javascript
<form id="form01" action="http://localhost:10000/chapter02/resource.html">
  <input type="hidden" name="test" value="test" />
  <input type="submit" />
  http://localhost:10000/chapter02/resource.html
</form>
<form id="form02" action="http://localhost:20000/chapter02/resource.html">
  <input type="hidden" name="test" value="test" />
  <input type="submit" />
  http://localhost:20000/chapter02/resource.html
</form>

<a href="http://localhost:10000/chapter02/resource.html">Link #1</a>
<a href="http://localhost:20000/chapter02/resource.html">Link #2</a>

<p id="result01"></p>
<p id="result02"></p>
<script>
  fetch("http://localhost:10000/chapter02/resource.html", {
    headers: { "X-CUSTOM-HEADER": "value" },
  })
    .then(() => {
      document.getElementById("result01").innerText = "#1 succeeded.";
    })
    .catch(() => {
      document.getElementById("result01").innerText = "#1 failed.";
    });
  fetch("http://localhost:20000/chapter02/resource.html", {
    headers: { "X-CUSTOM-HEADER": "value" },
  })
    .then(() => {
      document.getElementById("result02").innerText = "#2 succeeded.";
    })
    .catch(() => {
      document.getElementById("result02").innerText = "#2 failed.";
    });
</script>
```

formタグで作成された「送信」より、http://localhost:20000/chapter02/resource.htmlにリクエストを送信してみます。

![](_images/Untitled%2017.png)

　　　　　　　　　　　　　　　　　　↓

![](_images/Untitled%2018.png)

![](_images/Untitled%2019.png)

下のaタグで作成した「Link #2」を試してみても、同様の結果が得られます。

以上より、JavaScriptによる自由度の高いリクエスト（fetchなど）に関しては同一オリジン内の制限が課されており、aタグやformタグなどでのリクエストに関しては制限されていない。ということがわかりました。

## クロスオリジンでアクセスが許可されているもの

- frame要素とiframe要素
- img要素
- script要素
- CSS
- form要素のaction属性

ここまで書いていて疑問に思ったことですが、form要素は同一オリジンポリシーによって制限されていません。formタグはactionの先がクロスドメインであっても、JavaScriptによってsubmitできます。

先ほどの例の場合だと、オリジン「http://localhost:10000」からhttp://localhost:20000/chapter02/resource.htmlにリクエストを送信する際、ユーザーの意図しないformを送信することも可能となります。

この仕様を悪用した攻撃手法として、CSRFがあります。

この辺りについて調べてみたもののまだ完全に知識が腹落ちしていないため、またまとまった段階で記事にしようと思います。

（ChatGPTに聞いてみたところ、「この動作が許可されている理由は主に後方互換性のためです」という回答だった。本当かどうかのソースは見つけられていないので情報お持ちの方はアドバイスいただければと思います）

## まとめ

### オリジンとは

URLのスキーム（プロトコル）、ホスト（ドメイン）、ポート番号によって定義されたもの。

ホスト名とドメイン名を省略せずに繋げて記述した形をFQDN（Fully Qualified Domain Name）と呼ぶ。

オリジンが異なっているものを指して、「クロスオリジン」と呼ぶ。

オリジンが同一であれば、「同一オリジン」と呼ぶ。

### 同一オリジンポリシーとは

JavaScriptなどのクライアントスクリプトから別のオリジンへのアクセスを禁止するセキュリティ上の制限のこと。

ブラウザのサンドボックスに用意された制限のひとつ。

アクセス制限は、以下の3つに分類され、それぞれで制限が異なる

8. ブラウザ内アクセス: ほぼ制限
9. ネットワーク越しのアクセス: 単純リクエストのみ許可
10. 埋め込み: 制限なし 

同一オリジンポリシーによって別オリジンへのアクセスを制限することで、セキュリティ的な脅威を回避することができるが、それでは困るといったシチュエーションも出てきた。

クロスオリジンのリソースを取り扱いたい時の仕組みとして、CORS（Cross-Origin Resource Sharing）がある。W3Cで仕様が策定され、2013年1月に勧告候補となる（正式な勧告は2014年1月16日）

次回はこちらのCORSについてまとめていこうと思います！！

## 参考

[https://shukapin.com/infographicIT/origin-policy](https://shukapin.com/infographicIT/origin-policy)

[https://hasegawa.hatenablog.com/entry/20130330/p1](https://hasegawa.hatenablog.com/entry/20130330/p1)

書籍

[https://www.amazon.co.jp/Webブラウザセキュリティ-Webアプリケーションの安全性を支える仕組みを整理する-米内貴志/dp/4908686106](https://www.amazon.co.jp/Webブラウザセキュリティ-Webアプリケーションの安全性を支える仕組みを整理する-米内貴志/dp/4908686106)