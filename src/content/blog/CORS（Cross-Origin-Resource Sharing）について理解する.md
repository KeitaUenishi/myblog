---
title: "CORS（Cross-Origin-Resource Sharing）について理解する"
id: r757aal
public: false
publishedAt: 2025-01-06
editedAt: null
description: "この記事について 現場で言葉は頻繁に聞くものの、なんとなーーくな感じでしかわかっていなかったCORSや、origin、SOP等のWebブラウザセキュリティ基礎知識について掘り下げながら理解する記事です"
tags:
  - Web
---


# この記事について

現場で言葉は頻繁に聞くものの、なんとなーーくな感じでしかわかっていなかったCORSや、origin、SOP等のWebブラウザセキュリティ基礎知識について掘り下げながら理解する記事です。

参考書籍はこちら

[https://www.amazon.co.jp/Webブラウザセキュリティ-Webアプリケーションの安全性を支える仕組みを整理する-米内貴志/dp/4908686106/ref=asc_df_4908686106/?tag=jpgo-22&linkCode=df0&hvadid=342647643803&hvpos=&hvnetw=g&hvrand=925902801670163864&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1009540&hvtargid=pla-1155626234851&psc=1&th=1&psc=1](https://www.amazon.co.jp/Webブラウザセキュリティ-Webアプリケーションの安全性を支える仕組みを整理する-米内貴志/dp/4908686106/ref=asc_df_4908686106/?tag=jpgo-22&linkCode=df0&hvadid=342647643803&hvpos=&hvnetw=g&hvrand=925902801670163864&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1009540&hvtargid=pla-1155626234851&psc=1&th=1&psc=1)

# CORSとは？

> オリジン間リソース共有 (Cross-Origin Resource Sharing, [CORS](https://developer.mozilla.org/ja/docs/Glossary/CORS)) は、追加の [HTTP](https://developer.mozilla.org/ja/docs/Glossary/HTTP) ヘッダーを使用して、ある[オリジン](https://developer.mozilla.org/ja/docs/Glossary/Origin)で動作しているウェブアプリケーションに、異なるオリジンにある選択されたリソースへのアクセス権を与えるようブラウザーに指示するための仕組みです。ウェブアプリケーションは、自分とは異なるオリジン (ドメイン、プロトコル、ポート番号) にあるリソースをリクエストするとき、オリジン間 HTTP リクエストを実行します。

引用

[https://developer.mozilla.org/ja/docs/Web/HTTP/CORS](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

日本語訳では「オリジン間リソース共有」と読まれます。

呼び方はCORSで「コルス」または「シーオーアールエス」という呼ばれ方をしています。

Webアプリ開発において必ずといっていいほど聞く言葉ですが、これまで「オリジン間」とか「リソース共有」とか言われても何となくしか理解していない上に、それが一体どんな意味合いを持っているのか全く腹落ちできていませんでした。

MDNを読んだり引用しただけではまだまだよくわからないので、一つ一つの単語について分解しながら、CORSってなんやねん！ を克服していこうと思います。

## これまで踏まえて、改めてCORSって？

日本語訳は「オリジン間リソース共有」と初めに書きました。

つまりそのままの解釈で、「別オリジンのサーバーへのアクセスを許可し、リソースを共有できる仕組み」のことを言います。

前項まででSOPで他のオリジンへのアクセスを制限していたにもかかわらず、なぜそんなことをするのでしょうか。

結論としては、Ajaxの普及・発展により異なるオリジンのAPIを呼び出したいという動機が生まれたことによります。

SOPの範囲内で異なるオリジンをAPIを呼び出す方法（JSONPなど）が考案されましたが、「裏技」のようなもので安全性に課題がありました。

そこで、より安全に利用するための仕組みとしてW3Cで仕様が策定され、2013年1月に勧告候補となりました（正式な勧告は2014年1月16日）。

現代のWebアプリケーション開発において、異なるオリジンのWeb APIを叩いてデータを取得する、という行為は当たり前のように行われています。

そのため、適切にCORSを活用することで、安全性を担保しつつ、自由度の高い通信が実現できるようになります。

具体的な実装ですが、設定は主にサーバーサイドで行います。

まず、CORSが設定されていない場合のリクエストの場合、以下のようにリクエストは送信できますが、レスポンスを返す段階でCORSエラーとしてブラウザ側に通知します。

![](_images/Untitled%2059.png)

これをCORSの仕組みを用いることで、以下のようになります。

![](_images/Untitled%2060.png)

具体的には、Access-Control-Allow-Originヘッダにリソースのオリジンが記載されていれば、ブラウザは別オリジンのリソースへのアクセスを許可します。

以下は設定の例です

```java
// 特定のオリジンを指定
Access-Control-Allow-Origin: http://example.com, https://example.com

// 全てのオリジンに対して許可（公開APIなどでない限り、基本的には用いない）
Access-Control-Allow-Origin: *
```



### 単純リクエスト（Simple Request）とPreflight Request


## まとめ

## 参考

[https://note.crohaco.net/2019/http-cors-preflight/](https://note.crohaco.net/2019/http-cors-preflight/)

[https://qiita.com/att55/items/2154a8aad8bf1409db2b](https://qiita.com/att55/items/2154a8aad8bf1409db2b)

[https://dev.classmethod.jp/articles/cors-cross-origin-resource-sharing-cross-domain/](https://dev.classmethod.jp/articles/cors-cross-origin-resource-sharing-cross-domain/)


[https://qiita.com/masaoki/items/dea5843c9baf59bee2dc](https://qiita.com/masaoki/items/dea5843c9baf59bee2dc)


[https://zenn.dev/qnighy/articles/6ff23c47018380](https://zenn.dev/qnighy/articles/6ff23c47018380)

[https://zenn.dev/chot/articles/09dc561b255b35](https://zenn.dev/chot/articles/09dc561b255b35)