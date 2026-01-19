---
title: "HTTP  (HyperText Transfer Protcol)についてのまとめ ③ ‐ HTTPのバージョンについて -"
id: 5gxbnvb
public: true
publishedAt: 2024-03-31
editedAt: null
description: "HTTPのバージョンについて HTTPのバージョンについては、以下のような変遷があり、現在も新たにHTTP/3がRFC9114として2022年に仕様策定されました。 - 1990年: HTTP/0.9"
tags:
  - Web
---


# HTTPのバージョンについて

HTTPのバージョンについては、以下のような変遷があり、現在も新たにHTTP/3がRFC9114として2022年に仕様策定されました。

- 1990年: HTTP/0.9
- 1996年: HTTP/1.0
- 1997年: HTTP/1.1
- 2015年: HTTP/2
- 2022年: HTTP/3

現在においては、「どのバージョンのみ」が取り扱われているということではなく、HTTP/1.1、HTTP/2、HTTP/3 など、それぞれのWebサイトによって複数のバージョンで通信が行われていることが分かります。

googleにて「google」と検索したときの開発者ツール (Networkタブ)

![](_images/Untitled%2041.png)

HTTP/1.1かHTTP/2か (HTTP/3か) 、ブラウザがHTTPリクエストを送信する際にはALPNというプロトコルネゴシエーションを行うためのTLS拡張が用いられます。

> 現在主流になっている HTTP のバージョンは、**HTTP/1.1** と **HTTP/2** の2つで、ウェブブラウザが [**https**](https://ja.wikipedia.org/wiki/HTTPS) スキームでのHTTPリクエストを送信する際（つまり、https:// で始まるURLにアクセスする場合です）、このどちらかが利用されます。どちらが選ばれるのかは、[**ALPN**](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation) という仕組みで決定しています。ALPN は [**TLS**](https://ja.wikipedia.org/wiki/Transport_Layer_Security) (Transport Layer Security) の拡張という形で実装されています。

[https://laboradian.com/alpn/#1_HTTP](https://laboradian.com/alpn/#1_HTTP)

# HTTP/0.9

厳密には0.9というバージョンが存在していたわけではなく、1.0がRFC1945で公開された後、それまで使われていたものを0.9と呼ぶようになったそうです。

メソッドはGETしかなく、ステータスコードなどもありません。レスポンスは単純にテキストを受け取るだけです。

> HTTP/0.9はエラーの判断もできず、送られてきたコンテントの日付やフォーマットの情報もなく（ファイルの中身や拡張子から察するしかない）、コンテントのサイズも分からない（コネクションが切断されてはじめてファイル終端が分かる）など問題もありました。しかし何よりも「アホみたいに単純」という特徴があり、ソケットプログラミングに慣れた人なら30分くらいでHTTP/0.9のサーバーを書けるでしょう。

[https://xtech.nikkei.com/dm/atcl/column/15/293600/102000012/](https://xtech.nikkei.com/dm/atcl/column/15/293600/102000012/)

# HTTP/1.0

1996年5月にRFC1945として発表されました。ものすごく単純なプロトコルだったHTTP/0.9から、様々な仕様が追加され複雑なものになりました。ただ、「クライアントからの接続・要求送信」「サーバーからの返送・返答と切断」という基本動作は大きく変わっていません。

[https://datatracker.ietf.org/doc/html/rfc1945](https://datatracker.ietf.org/doc/html/rfc1945)

具体的に追加された機能としては、以下があります。

- リクエストとレスポンスの両方にHTTPヘッダーの概念が導入
- GET以外のメソッドが定義 (GET, HEAD, POST)
- ステータスコードの定義 (1xx 〜 5xx)
- `Content-Type`ヘッダーによってプレーンなテキストファイル以外の文書も送受信できるようになった
- cookie, basic認証などの定義が追加

最も大きな変化と言えるのは「POST」メソッドの登場で、HTTP/0.9が「クライアントがサーバーからデータを取得するだけ」の片方向のプロトコルだったのに対し、POSTは「クライアントからサーバーにデータを送る」ことを可能にしました。

これによってHTTPは双方向のプロトコルになり、掲示板などといった投稿型のコンテンツを作成することもできるようになりました。

# HTTP/1.1

1997年にRFC2068として発表され、1999年にRFC2616として標準化されました。

現在も使用されているプロトコルで、これまで数々の拡張や改定が行われてきています。

- [Upgrading to TLS Within HTTP/1.1 (RFC2817)](https://www.ietf.org/rfc/rfc2817.txt)
- [Defining Well-Known Uniform Resource Identifiers (URIs) (RFC5785)](https://www.ietf.org/rfc/rfc5785.txt)
- [Use of the Content-Disposition Header Field in the Hypertext Transfer Protocol (HTTP) (RFC6266)](https://www.ietf.org/rfc/rfc6266.txt)
- [Unicast-Based Rapid Acquisition of Multicast RTP Sessions (RFC6285)](https://www.ietf.org/rfc/rfc6285.txt)
- [Hypertext Transfer Protocol (HTTP/1.1): Message Syntax and Routing (RFC7230)](https://www.ietf.org/rfc/rfc7230.txt)
- [Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content (RFC7231)](https://www.ietf.org/rfc/rfc7231.txt)
- [Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests (RFC7232)](https://www.ietf.org/rfc/rfc7232.txt)
- [Hypertext Transfer Protocol (HTTP/1.1): Range Requests (RFC7233)](https://www.ietf.org/rfc/rfc7233.txt)
- [Hypertext Transfer Protocol (HTTP/1.1): Caching (RFC7234)](https://www.ietf.org/rfc/rfc7234.txt)
- [Hypertext Transfer Protocol (HTTP/1.1): Authentication (RFC7235)](https://www.ietf.org/rfc/rfc7235.txt)

参考

[https://qiita.com/akase244/items/9dcd819c942ec9ae41d9](https://qiita.com/akase244/items/9dcd819c942ec9ae41d9)

2024年現在においてもHTTP/1.1の仕様を用いての通信は一般的に行われており、拡張が行われているとはいえ初めの標準化から25年も現役でい続けているということになります。

ここではHTTP/1.0に対して、初版であるRFC2068時点でどのような機能追加が行われたかということについて触れていきます。

## HTTP/1.1から追加された仕様

HTTP/1.1では多数のオプションヘッダーが追加定義され、いくつか新しい試みも導入されました。その中でも代表的なものを挙げていきます。

### **通信の高速化**

【Keep-AliveによるPersistent Connection】

HTTP/1.0で問題だった点として、HTTPはTCPであるため3ウェイハンドシェイクを行います。パケットが一往復するのにかかる時間をRTT (Round-Trip Time) といいますが、TCPは接続と切断のために1.5RTTを要します。そのためリクエストのたびにこのハンドシェイクが発生し、時間のロスが大きくなってしまうという点がありました。

![](_images/Untitled%2042.png)

参照: [https://www.honai.me/blog/post/how-http-works-1-http1-keep-alive/#keep-aliveによる高速化](https://www.honai.me/blog/post/how-http-works-1-http1-keep-alive/#keep-alive%E3%81%AB%E3%82%88%E3%82%8B%E9%AB%98%E9%80%9F%E5%8C%96)

そこで、このロスを解消するため、HTTP/1.1ではKeep-Aliveという機能がデフォルトの実装となりました。

仕組みとしては、先ほどの画像のリクエスト1が終了した後も、TCPコネクションを切断せずに次のリクエストで再利用します。レスポンスの終わりを明確にする必要があるため、クライアントはレスポンスヘッダーの`Content-Length`を見てリクエストがいつ終わるかを判定します。

また、サーバーとクライアント

![](_images/Untitled%2043.png)

参照: [https://www.honai.me/blog/post/how-http-works-1-http1-keep-alive/#keep-aliveによる高速化](https://www.honai.me/blog/post/how-http-works-1-http1-keep-alive/#keep-alive%E3%81%AB%E3%82%88%E3%82%8B%E9%AB%98%E9%80%9F%E5%8C%96)

以下のブログで実際にパケットキャプチャを取られている方がいて、非常にわかりやすいです。

[https://y0d3n.hatenablog.com/entry/2021/07/01/205451](https://y0d3n.hatenablog.com/entry/2021/07/01/205451)

keep-aliveはヘッダーのConnectionに以下のように設定されています

![](_images/Untitled%2044.png)


【HTTP Pipelining】

Persistent Connectionからもう一歩踏み込み、Keep-Aliveを前提として最初のリクエストが完了する前に次のリクエストを続けて送信することにより高速化を図ったものです。

以下はMDNから引用した画像ですが、一番右のモデルになります。

![](_images/Untitled%2045.png)

参照: [https://developer.mozilla.org/ja/docs/Web/HTTP/Connection_management_in_HTTP_1.x](https://developer.mozilla.org/ja/docs/Web/HTTP/Connection_management_in_HTTP_1.x)

Persistent Connectionよりも高速に処理が行える技術ですが、HOLブロッキング (Head-Of-Line-blocking) と呼ばれる問題（リクエストが来た順にレスポンスを返す必要があり、遅いレスポンスがあると次のレスポンスが待ち状態になる）や、エンドポイント間にHTTP/1.0しか解釈できないプロキシがあった場合に動作不能になってしまうなど、いくつかの問題を抱えており広く使われる技術ではありませんでした。

しかしこの技術は改善を経て、のちのHTTP/2でストリームという仕組みとして生まれ変わります。

### **TLSのサポート**

HTTPSで通信を行うための暗号化を行うプロトコルであるTLSをサポートしています。そのため、よりセキュアな通信が可能になりました。

### **チャンク方式**

サーバーからクライアントへデータを送信する際に、一括で送るのではなく小分けにして送る方式です。こうすることで、時間のかかるデータの転送を少しずつ行うことができます（具体的には検索結果やライブ配信など、どれくらいの大きさかわからないが巨大なデータ）。

チャンク方式であることを指定するためには、レスポンスヘッダーで `**Transfer-Encoding: chunked**`**  **を指定します。また、この場合Content-Lengthヘッダーは省略されます。

以下、Transfer-Encodingでchunkedを指定した際の具体例の引用です

> Transfer-Encodingはこれを柔軟化しようとした仕組みで、HTTP/1.1では "chunked" という分割送信方式が定義されています。Transfer-Encoding: chunked のモードでは、送信データは任意長の「チャンク（塊）」に分割され、それぞれのチャンクがチャンク長を示す「チャンク・ヘッダー」と空行（※注9）の「チャンク・フッター」に挟まれて送信されます。
> ※注9：仕様上チャンク・フッターはHTTPヘッダーと同形式として定義されており、空行で終端する任意行の情報を付加できることになっていますが、実際にはほとんど空行として実装されています。
> 
> **例：通常の Content-Length モード**
> 
> **HTTP/1.1 200 OK<CR><LF>**
> 
> Content-Length: 49<CR><LF>
> 
> <CR><LF> <= HTTP ヘッダーの終わりを示す空行
> 
> The quick red fox jumpes over the brown lazy dog. <= コンテント 49 バイト
> 
> **例：Chunked Encoding モード**
> 
> **HTTP/1.1 200 OK<CR><LF>**
> 
> Transfer-Encoding: chunked<CR><LF> <CR><LF> <= HTTP ヘッダーの終わりを示す空行
> 
> 12<CR><LF> <= チャンク長 0x12=18 バイト（チャンク・ヘッダー）
> 
> The quick red fox
> 
> <CR><LF> <= チャンクの終わりを示す空行（チャンク・フッター）
> 
> b<CR><LF> <= チャンク長 0x0b=11 バイト
> 
> jumpes over
> 
> <CR><LF>
> 
> 14<CR><LF> <= チャンク長 0x14=20 バイト
> 
> the brown lazy dog.
> 
> <CR><LF>
> 
> 0<CR><LF> <= チャンク長 0:コンテントの終わり

[https://xtech.nikkei.com/dm/atcl/column/15/293600/102000012/?P=3](https://xtech.nikkei.com/dm/atcl/column/15/293600/102000012/?P=3)

送信されたchunkはそれぞれサイズが記されており、最後に0byteと送信することでコンテンツの切れ目を知らせることができるようになっています。

![](_images/Untitled%2046.png)

参照: [https://scrapbox.io/poccariswet/chunked_transfer_encodingってなに](https://scrapbox.io/poccariswet/chunked_transfer_encoding%E3%81%A3%E3%81%A6%E3%81%AA%E3%81%AB)

このチャンク方式ですがHTTP/2では廃止され、代わりにデータフレームという仕組みが用いられています。

### メソッドの追加

PUTメソッドとDELETEメソッドが標準化され、OPTIONS、TRACE、CONNECTメソッドが新たに追加されました。

### バーチャルホスト

同じIPアドレスを複数のドメインで共有できる機能です。これによって何ができるかというと、1つのWebサーバーで異なるウェブサイトを公開することが可能になります。

バーチャルホストはHostヘッダーにドメインを指定することで、ある1台のサーバに「[hoge.example.com](http://hoge.example.com/)」と「[fuga.example.com](http://fuga.example.com/)」というドメインがあってもそれぞれを判別できるようになります。

## ちょっとした追記

### チャンクと動画ストリーミング

TCP/IPについての記事を前回書いた時、動画のストリーミング再生のような仕組みがTCPであるHTTPで動くのが全く腹落ちしていなかったけれど、Keep-AliveとTransfer-Encoding: chunked が知識として入ると、「なるほど、この組み合わせでできそうやん」と点と点がつながった感じがしました。

[https://www.uenishi.blog/posts/study-tcp-ip#ちょっとした追記](https://www.uenishi.blog/posts/study-tcp-ip#ちょっとした追記)

> とはいえライブストリーミングしている動画のように、予めファイルサイズが分からないような物を転送したいというケースもあります。そういう場合に使うのが、`Transfer-Encoding: chunked`です。これは転送したいファイルを一度に送るという通常のHTTPでのファイルの伝送方法とは異なり、細切れにして少しずつ送っていくという伝送方法です。これによりHTTPサーバーは「とりあえず1kBだけ送信する」ということが可能になります。

[https://qiita.com/Silphire/items/e88336b589e73c73ebf5#transfer-encoding-chunked](https://qiita.com/Silphire/items/e88336b589e73c73ebf5#transfer-encoding-chunked)

動画の通信方式に関してはこれまためちゃくちゃ大きめなテーマになりそうなので、別記事でまとめていきたいなと思います（こうやってどんどんまとめていきたいものが増えていく）。

# HTTP/2

2012年9月からIETFで標準化作業がスタートし、2015年5月にRFC7540, RFC7541として公開されました。現在はRFC9113が最新のものとなっています。

2010年頃より、Webがより発達し各ページの見た目や振る舞いがリッチになってきました。それに伴なってブラウザとサーバーでやり取りされるデータやファイルの量も多くなり、従来のHTTP/1.1であった課題点が浮き彫りになってきました。

## HTTP/1.1が抱えていた課題

### Head-Of-Line-blocking問題とコネクションの多重化

Keep-Aliveで、TCPコネクション内で多数のリクエストを一度に送信できるようになりました。しかし、HTTP/1.1ではリクエストを1 → 2 → 3 → 4 と順番に送信した場合、レスポンスも1 → 2 → 3 → 4 の順番で返す必要があります。

これによって、例えば2のリクエストが非常に時間がかかるものだった場合、3, 4 のレスポンスは返す用意が完了していたとしてもクライアントに送信することができませんでした。

上記のような制約に対処するために、現在主流のモダンブラウザは1ドメイン（サーバー）に対して複数のTCP接続を張ることで、多重化を実現してきました。これによって複数（Chromeでは6つまで）のコネクション上でリクエストとレスポンスを同時に行うことができていましたが、実装の複雑化やサーバーの負荷上昇などの問題を抱えていました。

> HTTP/1.x のコネクションはリクエストが整理されることもなく連続するため、十分な帯域を使用できない状況では最適化できません。その解決策として、ブラウザーはそれぞれのドメインに対して複数のコネクションを開いて、リクエストを並行して送信します。既定では一度に 2 から 3 つのコネクションですが、現在は主に 6 つの並列したコネクションへ増えています。この数をさらに増やそうとすると、サーバー側で [DoS](https://developer.mozilla.org/ja/docs/Glossary/DOS_attack) 防御が発動する危険性があります。

[https://developer.mozilla.org/ja/docs/Web/HTTP/Connection_management_in_HTTP_1.x#ドメインシャーディング](https://developer.mozilla.org/ja/docs/Web/HTTP/Connection_management_in_HTTP_1.x#ドメインシャーディング)

※ HTTP/1.1の規定では最大2つまでと制限されているはずのコネクションが現在何故6つになっているのか、経緯は気になりますがここでは割愛（2でやってられるか！ 的な理由で拡張されてきたのだろうかと予想…）

### プロトコルオーバーヘッド

HTTPはステートレスなプロトコルといわれていますが、現代では認証情報やお買い物かごの情報など、ステートを保持していることも多くなりました。これらはCookieや独自のトークンなどをリクエストヘッダに設定して送信しています。場合によってはこのヘッダーだけでも数十KBになってしまう上に、リクエストのたびに毎回送信されています。小さなリソースを取得するリクエストを大量に送る場合など、オーバーヘッドが大きくなりがちでした。

## HTTP/2の特徴

HTTP/2はHTTP/1.1が抱えていた課題を解決する形で、以下のような特徴を持っています。

- 1つのTCP接続（ストリーム）
- バイナリベース
- ストリームを使ったデータの送受信
- サーバープッシュ
- ヘッダの圧縮

### 1つのTCP接続

ひとつのTCPコネクション接続上に「ストリーム」という仮想的な通信経路を作ることによって、複数のリクエストとレスポンスを同時並行で処理できるようになります。

ストリームには「ストリームID」と呼ばれる一意のIDがあります。Webクライアントから開始したストリームは奇数のストリームIDを使用して、Webサーバーから開始されたストリームは偶数のストリームIDを使用します。

コネクション自体を意味する制御用の「ストリームID 0」は、HTTPのやり取りでは使用されません。

![](_images/Untitled%2047.png)

参照: [https://blog.redbox.ne.jp/http2-cdn.html](https://blog.redbox.ne.jp/http2-cdn.html)

図のように、HTTP/2では1つのコネクション上で複数のリクエストとレスポンスを並列に扱うことができます。これによって、HTTP/1.1時代で問題となっていたHead-Of-Line-Blocking問題を解決します。

実際の通信に関しては、以下の記事での検証結果が分かりやすいです。

[https://qiita.com/mogamin3/items/7698ee3336c70a482843#1つのtcp接続](https://qiita.com/mogamin3/items/7698ee3336c70a482843#1つのtcp接続)

ストリーム上ではデータは「フレーム」という単位でやり取りされ、従来のHTTPヘッダの役割をするHEADERSフレームや実際のデータ (body) が送信される際に用いられるDATAフレーム、クライアントへのなどがあります。

| **名称** | **タイプ** | **役割** |
| --- | --- | --- |
| DATA | 0 | メッセージのボディを送信 |
| HEADERS | 1 | メッセージのヘッダーを送信 |
| PRIORITY | 2 | ストリームの優先度を指定（クライアントのみ送信可能） |
| RST_STREAM | 3 | ストリームの終了要求 |
| SETTINGS | 4 | コネクションの設定とそのACK |
| PUSH_PROMISE | 5 | サーバプッシュのための事前通知（サーバーのみ送信可能） |
| PING | 6 | アイドル状態のコネクションの確認 |
| GOAWAY | 7 | コネクションの終了 |
| WINDOW_UPDATE | 8 | フロー制御 |
| CONTINUATION | 9 | フレームの継続送信 |

> WEB高速化を行っている方は、「ページ最後にJavascript」という呪文を聞いたことがあるのではないでしょうか。これはページの表示に関係ないJavascriptなどのリソースの読み込みよりHTMLやCSSなどを優先的にロードしてもらうための１つの方法です。
> HTTP/2でもストリームの多重化によりブロックされることは無くなりましたが、同じようにレンダリングに関係ないリソースは後回しにする（優先度を下げる）必要があります。HTTP/2の世界でいうと重要なストリームが返却を待たされてしまう可能性があるということです。これを解決するために、HTTP/2ではクライアントがPRIORITYフレー ムを用いてストリームに優先度を付けることが可能となりました。

[https://blog.redbox.ne.jp/http2-cdn.html](https://blog.redbox.ne.jp/http2-cdn.html)

PRIORITYでの優先順位付けは「重み付け」と「依存関係」があり、以下のようなことが可能となっています。

- ストリームAを他のストリームより優先させる
- ストリームBとストリームＣに対して、「2 : 5」のように重みをつける

リソースの読み込み順など、HTTP/1.1では工夫によってなんとかしていたところがプロトコルベースで設定できるようになったのも嬉しいポイントですね。

### バイナリベース

HTTP/2以前のメッセージ形式はプレーンテキストでのやり取りでしたが、HTTP/2ではバイナリベースのやり取りとなりました。テキストベースでのやり取りは非常にシンプルでわかりやすいものでしたが、1行目にパスとメソッドが来て、そこから次の空行まで1行ずつ `key:value` でヘッダーが来て……という形で上から順番に読んでいく必要があり、無駄が多いという弱点もありました。

HTTP/2ではバイナリベースとなり、前述の通りヘッダーやボディは別々のフレームとして送信されてきます。そのためそれぞれのフレームに合わせた処理を行えばよく、テキストベースの時よりも効率的に解釈することができます。

### ヘッダの圧縮

ヘッダに多くの情報が含まれる場合にオーバーヘッドになってしまう、という問題はHTTP/1.1が抱えている問題としてありました。

そこで、HTTP/2ではヘッダの圧縮機能が付きました。ヘッダはHPACKという方式を用いて圧縮されます。

HPACKはHTTP/2とは別にRFC7541で標準化されている仕組みです。ここでは詳細仕様までは触れませんが、HPACKのフォーマットを用いることで、1度送信したヘッダーを再送信せず必要な差分のみを送信することが可能となりました。これにより、通信の冗長なやり取りを省くことができるため、サーバー負荷やトラフィックの軽減に貢献します。

[https://tex2e.github.io/rfc-translater/html/rfc7541.html](https://tex2e.github.io/rfc-translater/html/rfc7541.html)

### サーバープッシュ

CSSやJavaScript、画像など要求されることが予想されるコンテンツを事前に送信する技術です。

以下の記事での具体的な解説が分かりやすかったので転記します。

> そこでサーバープッシュです。サーバープッシュは今回の例で言うと`index.html`と同時に`img/hachioji.jpg`も(クライアントからのレスポンスなく)返すことができるというものです。サーバーからリソースをプッシュするのでサーバープッシュです。

[https://qiita.com/mogamin3/items/7698ee3336c70a482843#サーバープッシュ](https://qiita.com/mogamin3/items/7698ee3336c70a482843#サーバープッシュ)

**※ サーバープッシュの現在**

Chromeでは現在（2022年8月以降）サーバープッシュ機能は廃止となったようです。

> [前回のお知らせ](https://groups.google.com/a/chromium.org/g/blink-dev/c/K3rYLvmQUBY/m/vOWBKZGoAQAJ?hl=ja)に続き、Chrome 106 および次期リリースのその他の Chromium ベースのブラウザでは、HTTP/2 サーバー プッシュのサポートがデフォルトで無効になります。

[https://developer.chrome.com/blog/removing-push?hl=ja](https://developer.chrome.com/blog/removing-push?hl=ja)

代わりに103 Eealy Hintsという仕組みを使って、サブリソースのリクエストを最適化することが提唱され、RFC8297として発表されています。

[https://tex2e.github.io/rfc-translater/html/rfc8297.html](https://tex2e.github.io/rfc-translater/html/rfc8297.html)

こちらについては解説記事の記載に留めますが、サーバープッシュを理解する必要性は現在ではあまりない、と思っていてよさそうです。

[https://zenn.dev/quiver/articles/46ba1852a80c9a](https://zenn.dev/quiver/articles/46ba1852a80c9a)

[https://asnokaze.hatenablog.com/entry/2020/11/13/001110](https://asnokaze.hatenablog.com/entry/2020/11/13/001110)


## その他HTTP/2についての参考資料

[https://kinsta.com/jp/learn/what-is-http2/](https://kinsta.com/jp/learn/what-is-http2/)

[https://www.infraexpert.com/study/tcpip16.7.html](https://www.infraexpert.com/study/tcpip16.7.html)

[https://xtech.nikkei.com/it/atcl/column/17/041200137/](https://xtech.nikkei.com/it/atcl/column/17/041200137/)

# HTTP/3

現在（2024年）時点で最新のHTTPとして、2022年6月にRFC9114として公開されたHTTP/3についても取り上げていきます。

HTTP/2とHTTP/3の通信手法は似ているところもありますが、大きく異なっているのは通信の下位プロトコルとしてTCPの代わりにQUICというUDPベースのプロトコルを使用することです。

以下ではHTTP/2の課題となっていた部分と、技術的な特徴について述べていきます。

## HTTP/2の問題だった部分

### Head-Of-Line-Blockingの問題

HTTP/1.1に引き続き、HTTP/2では新たなHead-Of-Line-Blockingの問題がありました。

HTTP/2までは、下位のプロトコルとしてTCPを使用していました。

TCPでは、送信者がパケットを送信した通りに、受信者がパケットを処理する必要があります。

そのため、パケットロスが発生した場合は送りなおしてもらう必要があり、パケットの順番が入れ替わった場合はもとの順番に戻す必要があります。

これによって何が起こるかというと、先に送信されたストリームでデータを運ぶパケットにパケットロスなどの問題が発生した場合、後続の他のデータを運ぶパケットを受信できても、問題が解消されるまでブラウザは処理を進めることができません（TCPはすべてのパケットが送受信できているかを保証するため）。これがTCPのHead-Of-Line-Blocking問題です。

> HTTP/2は多重化を実現し、ヘッドオブラインブロッキング（先頭のパケットの転送エラー時、再送するまで後続のパケットがブロックされること）を緩和しましたが、TCPによる制約は残ります。データ転送の際、多重化した複数ストリームは単一のTCPコネクションを使用できますが、ストリームの1つでパケットロスが発生すると、TCPが失われたパケットを再送するまで、**接続全体およびそのすべてのストリームが人質に取られた状態になります**。

[https://kinsta.com/jp/blog/http3/#quic-http3](https://kinsta.com/jp/blog/http3/#quic-http3)

> パケットロス率が上がるにつれて、HTTP/2 のパフォーマンスはますます低下します。
> 2 %のパケットロス (これはかなりひどいです、念のため。) があるネットワーク環境では、大抵の場合において HTTP/1 のほうがパフォーマンスが良くなることがテストで証明されています。
> 
> これは、HTTP/1 では通常6つまでの TCP コネクションを使ってパケットを送信するためです。

[https://http3-explained.haxx.se/ja/why-quic/why-tcphol](https://http3-explained.haxx.se/ja/why-quic/why-tcphol)

つまり、HTTP/1.1ではアプリケーション層であるHTTPレベルでのHead-Of-Line-Blocking問題がありました。これをHTTP/2ではストリームによる多重化というアプローチによって解決しています。しかし、よりHTTP/2ではより下層のレイヤであるトランスポート層のTCPによるHead-Of-Line-Blocking問題が残っていました。これを解決するためにUDPベースのQUICを用いたのがHTTP/3となります。

### 接続確立までにかかる時間

HTTP/2での接続を確立するまでには、コネクションを確立するためのTCPによる3wayハンドシェイクと、暗号化のためのTLSハンドシェイクのどちらもが必要になります。

しかし、これらは仕様上同時に行うことはできません。

それがOssification (硬直化) と呼ばれる問題です。

- TCPは平文のプロトコルで、ファイアーウォール等が通信内容を監視している
- TCPとTLSのハンドシェイクを同時にするような、改良されたTCPを使うとファイアーウォールが「怪しい」となり接続を切ってしまう

TCPの改良が難しいもう一つの理由としては、TCPがカーネル (OS) が提供する機能のためです。

これは新しいプロトコル拡張を作っても、ユーザーがその機能に対応した新しいOSにアップグレードするまで待たなければならず、トライ & エラーでプロトコルの改良を進めることが難しい、という点こともあります。

## HTTP/3の特徴

HTTP/3はHTTP/2に基づいて作成され、多くの概念を引き継いでいますが最大の特徴はトランスポート層のプロトコルがTCPからUDP + QUICに変更されたことです。そのためいくつかのQUICが対応した細かい部分をHTTPレイヤから外しています。

### QUIC

もともとは  Quick UDP Internet Connections の略称として呼ばれていましたが、QUICという単語となりRFC9000で標準化されました。

UDPをベースにしたトランスポート層のプロトコルです。TCPとTLSが提供してきた両者の機能をどちらも担い、暗号化されたトランスポート層の通信を実現します。

前述したように、HTTP/2での問題点はトランスポート層のプロトコルがTCPであることに起因するものでした。

![](_images/Untitled%2048.png)

参照: [https://xtech.nikkei.com/atcl/learning/lecture/19/00038/00001/?P=3](https://xtech.nikkei.com/atcl/learning/lecture/19/00038/00001/?P=3)

そこで、TCPにとって代わる存在としてQUICがRFC9000として発表されました。QUICによって解決される課題と特徴は以下の通りです。

- TCP/TLSの問題を解消
    - Head-Of-Line-Blockingの発生を防止
        - あるストリームでエラーが発生して再送処理が必要になっても、他のストリームに影響を与えず並行して処理が可能
    - 接続確立までの時間を最小化（トランスポート層のハンドシェイクと暗号化のハンドシェイクを同時に行う）
    - 改良の難しかったTCPから離れ、プロトコルスタックがアプリケーションの一部として実装されるのでアップグレードが容易になる
- TCP相当の再送制御
- IPアドレスが変わっても通信を継続できる
    - TCPでは、5タプルという情報でコネクションを識別していた（送信元IPアドレス、送信先IPアドレス、IPヘッダのプロトコル、送信元ポート番号、送信先ポート番号）
        - 一つでも変わるとコネクションを継続できなかった
    - QUICでは、コネクションIDでコネクションを識別している
        - そのため、IPアドレスやポート番号が変わってもコネクションを継続できる
        - クライアントが自発的に通信経路を切り替える「コネクションマイグレーション」の機能も持っている
            - 例えば、携帯の電波 → Wi-Fi接続に切り替わったり、移動中で違う回線がつながった場合などでも切断されない
- より早い新機能の提供
    - QUICはユーザーランドで動作するブラウザなどのアプリケーションで処理される
        - TCPのOSで動作することによる、アップデートの難しさを改善
- トランスポート層からのTLS暗号化によりセキュリティ向上

また、HTTP/3は当初「HTTP/2 over QUIC」と呼ばれていました。これはHTTP/2の特徴を継承しているからです。具体的には、バイナリプロトコルであること、通信が多重化されていること、HTTPヘッダを圧縮できることが挙げられます。

![](_images/Untitled%2049.png)

参照: [https://http3-explained.haxx.se/ja/the-protocol](https://http3-explained.haxx.se/ja/the-protocol)

### Alt-Svc: レスポンスヘッダ

最初のコネクションがHTTP/2 、またはHTTP/1を使用している場合、サーバーはAlt-Svcに以下のような形で「HTTP/3で接続可能ですよ」ということを通知します。
`Alt-Svc: h3=":443"`

Alt-SvcはQUICやHTTP/3のために設計されたわけではなく、もともとあるHTTPのレスポンスヘッダーです。

例えば、上記の例だとHTTP/3がレスポンスを受け取った同じホスト名の、UDPポート443で利用できることを示します。

クライアントはその宛先ホストに対してQUICコネクションの確立を試みることが可能で、成功した場合は初めに送信したHTTPのバージョンではなく、HTTP/3でオリジンと接続を続けることができるようになります。

### 優先度制御

HTTP/2ではPRIORITYフレームを用いて優先度の制御を行うことが可能でしたが、この優先度付けの仕様は複雑で、あまり実装されていないようでした。

[https://asnokaze.hatenablog.com/entry/2019/11/07/020354](https://asnokaze.hatenablog.com/entry/2019/11/07/020354)

そのため、HTTP/3の仕様からは削除され、個別の取り組みとしてHTTP/2でも使用可能な仕様の策定が行われました。これは2022年6月に新たにRFC9218として標準化されています。

[https://tex2e.github.io/rfc-translater/html/rfc9218.html](https://tex2e.github.io/rfc-translater/html/rfc9218.html)

また、余談ですがこのRFC9218で定義されたpriorityヘッダーは、Chrome124以降はすべてのHTTPリクエスト時にデフォルトで付与されるようになったようです。

> This feature adds the 'priority' request header for all HTTP requests with the priority information for the request at the time that it was sent.
> RFC 9218 (Extensible Prioritization Scheme for HTTP) defines a 'priority' HTTP request header to use for signaling request priority to origins (and intermediaries). It also defines negotiation processes and protocol-level frames for HTTP/2 and HTTP/3 to carry the same priority information.

> この機能は、すべての HTTP リクエストに対して、リクエスト送信時の優先度情報を持つ 'priority' リクエストヘッダを追加します。
> RFC 9218 (Extensible Prioritization Scheme for HTTP) は、リクエストの優先度を発信元(と中継元)に通知するために使う 'priority' HTTP リクエストヘッダを定義しています。また、HTTP/2 と HTTP/3 が同じ優先度情報を伝えるためのネゴシエーションプロセスとプロトコルレベルのフレームも定義しています。

[https://chromestatus.com/feature/5109106573049856](https://chromestatus.com/feature/5109106573049856)

### QPACK

HTTP/2ではHPACKというアルゴリズムによって、HEADERSフレームを圧縮して送信していました。

QPACKはHTTP/3から導入された新たな圧縮アルゴリズムで、HPACKと似ていますが送信するストリームの順序に関わらず動作するように変更されています。

## HTTP/3についての参考

[https://http3-explained.haxx.se/ja/why-quic](https://http3-explained.haxx.se/ja/why-quic)

[https://speakerdeck.com/yahiru/3-debian-warukoto](https://speakerdeck.com/yahiru/3-debian-warukoto)

[https://www.publickey1.jp/blog/21/http3web_tcptlshttp2http3fastly.html](https://www.publickey1.jp/blog/21/http3web_tcptlshttp2http3fastly.html)

[https://en-ambi.com/itcontents/entry/2023/08/18/093000/](https://en-ambi.com/itcontents/entry/2023/08/18/093000/)

[https://eng-blog.iij.ad.jp/archives/10039](https://eng-blog.iij.ad.jp/archives/10039)

# HTTPのバージョンとRFC

以下で開設されている画像が非常にわかりやすかったので引用させていただきます。

![](_images/Untitled%2050.png)

[https://gihyo.jp/admin/serial/01/http3/0001](https://gihyo.jp/admin/serial/01/http3/0001)

# まとめ

出来心からHTTPがどういったプロトコルで、どんな歴史的経緯があってバージョンアップを行ってきたのか、を掘り下げていくとベースの知識を身に着けるだけでもとんでもない長旅になってしまいました。ただ、こうして長旅ながらいろいろ情報をまとめていくにつれ、自分が全く知識として落とし込めていなかった部分が多大にあり、まだまだ世界は広く非常に勉強になったと感じます。プロトコルの世界、奥が深すぎる…。

# 参考

[https://asnokaze.hatenablog.com/entry/2021/06/07/010727](https://asnokaze.hatenablog.com/entry/2021/06/07/010727)

[https://kinsta.com/jp/knowledgebase/tls-vs-ssl/#cert](https://kinsta.com/jp/knowledgebase/tls-vs-ssl/#cert)

[https://blog.neno.dev/entry/2023/04/22/190510](https://blog.neno.dev/entry/2023/04/22/190510)
