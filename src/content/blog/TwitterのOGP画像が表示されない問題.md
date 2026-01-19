---
title: "TwitterのOGP画像が表示されない問題"
id: t3q0ccy
public: true
publishedAt: 2023-08-08
editedAt: null
description: "OGPで定期的に色々躓いていて、特にTwitterがある時期から画像表示されんな… と思っていたら、鬼のような凡ミスが原因だったので書き記しておきます。 現象 TwitterのOGPが表示されない…"
tags:
  - ogp
  - Bug
---


OGPで定期的に色々躓いていて、特にTwitterがある時期から画像表示されんな…

と思っていたら、鬼のような凡ミスが原因だったので書き記しておきます。

## 現象

TwitterのOGPが表示されない…

![](_images/Untitled%2092.png)


見た感じmetaタグも問題なさそうだし、TwitterのCard ValidatorもINFOになっている…

![](_images/Untitled%2093.png)

![](_images/Untitled%2094.png)

なんでや…

なんでなんや……

時間を見つけては悩み、忘れていました。

ある日突然、冷静になって、もう一度見返してみました（そしてChatGPTにもいろいろ質問した）

![](_images/Untitled%2095.png)


![](_images/Untitled%2096.png)


お分かりいただけただろうか

[https://www.uenishi.blog//images/blog-og-image.jpg](https://www.uenishi.blog//images/blog-og-image.jpg)

「uenishi.blog**//**image」

スラッシュ2個入っとるやん…

Facebookのシェアデバッガー見に行ったらちゃんと書いていた

![](_images/Untitled%2097.png)


## 308が返る

改めて、[https://www.uenishi.blog//images/blog-og-image.jpg](https://www.uenishi.blog//images/blog-og-image.jpg)を叩いてNetworkを見てみると、以下のような結果が返っていました。

![](_images/Untitled%2098.png)

![](_images/Untitled%2099.png)

> The HyperText Transfer Protocol (HTTP) `**308 Permanent Redirect**` リダイレクトステータスコードは、リクエストされたリソースが [`Location`](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Location) ヘッダーで示された URL へ完全に移動したことを示します。ブラウザーはこのページにリダイレクトし、検索エンジンはリソースへのリンクを更新します (「SEO 用語」では、「リンクジュース」が新しい URL に送られたと言われます)。

[https://developer.mozilla.org/ja/docs/Web/HTTP/Status/308](https://developer.mozilla.org/ja/docs/Web/HTTP/Status/308)

正しいURL（[https://www.uenishi.blog/images/blog-og-image.jpg](https://www.uenishi.blog//images/blog-og-image.jpg)）だと304になる。

![](_images/Untitled%20100.png)

![](_images/Untitled%20101.png)

> HTTP `**304 Not Modified**` クライアントリダイレクトレスポンスコードは、リクエストされたリソースを再送する必要がないことを示します。これはキャッシュされたリソースへの暗黙のリダイレクトです。これは、[`GET`](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/GET) や [`HEAD`](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/HEAD) リクエストのようなリクエストメソッドが [safe](https://developer.mozilla.org/ja/docs/Glossary/Safe) である場合、またはリクエストが条件付きで [`If-None-Match`](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/If-None-Match) もしくは [`If-Modified-Since`](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/If-Modified-Since) ヘッダーを使用しているときに発生します。

[https://developer.mozilla.org/ja/docs/Web/HTTP/Status/304](https://developer.mozilla.org/ja/docs/Web/HTTP/Status/304)


metaタグにある画像のURLを読みに行った際、308が返ってきていたせいで画像として認識できておらず、結果としてツイートに画像が表示されなくなっていた感じかと思われます。

twitter:imageにあるURLを [https://www.uenishi.blog/images/blog-og-image.jpg](https://www.uenishi.blog//images/blog-og-image.jpg) とすることで、無事解決しました。めでたしめでたし……


![](_images/Untitled%20102.png)

こんなしょーもない凡ミスに時間溶かしすぎたと思いつつ、勉強になったなぁと思うこととします。
