---
title: "HTTP (HyperText Transfer Protcol)についてのまとめ ①"
id: 5gq02dy
public: true
publishedAt: 2024-03-09
editedAt: null
description: "TCP/IPについて書いた記事の続きです。 https://www.uenishi.blog/posts/study-tcp-ip こちらではアプリケーション層のプロトコルについて、Webアプリケーシ"
tags:
  - Web
---



TCP/IPについて書いた記事の続きです。

[https://www.uenishi.blog/posts/study-tcp-ip](https://www.uenishi.blog/posts/study-tcp-ip)

こちらではアプリケーション層のプロトコルについて、Webアプリケーション開発においては最も必須と思われるHTTP (HyperText Transfer Protocol) について深掘りしていこうと思います。

書いている途中で盛りだくさんになってきて終わる気がしなかったので分割しています。ここでは主にリソースやメソッドについてつらつらと……。

# 概要

- WebサーバーとクライアントがHTMLなどの情報をやり取りする際に使われるプロトコル
    - 名前こそHyperText用のプロトコルだが、実際にはHTMLやXMLなど以外にも、静止画、音声、動画、JavaScriptプログラムなど基本的にコンピューターで扱えるデータであればなんでも転送できる
    - クライアントからHTTPリクエストを送信し、WebサーバーがHTTPレスポンスを返却する
    - HTTPリクエストには「GET」や「POST」のようなメソッドが用意されており、用途に応じて使い分ける
- セキュリティを強化したものとして、HTTPSというプロトコルもあるが、コアとしての機能は大きな違いはない。
- TCPの80番ポートを使用する（HTTPSは443番）
- 原則としてステートレス
    - HTTP Cookieなどによってステートフルなセッションを実現することも可能
- コネクションベースであるTCP標準に依存している
    - 実際には下層のトランスポート層にあるプロトコルがコネクションベースであることには依存せず、「信頼性がある」ことだけをHTTPは要求する
        - そのため「結果的に」トランスポート層で「信頼性がある」TCPに依存しているという形になる
    - HTTP/1.0規定の動作は、それぞれのリクエスト/レスポンスのペアに対して個別にTCPコネクションを開いている
        - 複数リクエストが送信されたときに非効率（TCPコネクションは結構重い処理なので、遅延が発生する）
            - HTTP/2ではひとつのコネクションで複数のメッセージを多重化するように進化した

HTTPは基本的にシンプルで人間が読めるように設計されています。 (HTTP/2でHTTPメッセージをフレームにカプセル化することにより、複雑さは増したようです。これについては後述します)

[https://developer.mozilla.org/ja/docs/Web/HTTP/Overview#http_の基本方針](https://developer.mozilla.org/ja/docs/Web/HTTP/Overview#http_の基本方針)

なお、本記事ではHTTPと並べて説明させることが多いWebアーキテクチャおよび設計思想である「REST (**Re**presentational **S**tate **T**ransfer) 」や「ROA (**R**esource **O**riented **A**rchitecture) 」については触れません。

# リソースとURI

HTTPに限らず様々なプロトコルにも関わってくる概念・仕様ですが、ここではよりHTTPについて理解を深めるためにまとめます。

## リソース

> The target of an HTTP request is called a "resource". HTTP does not limit the nature of a resource; it merely defines an interface that might be used to interact with resources. Most resources are identified by a Uniform Resource Identifier (URI), as described in Section 4.

> HTTPリクエストのターゲットは "リソース "と呼ばれる。HTTPはリソースの性質を制限するものではなく、単にリソースと相互作用するために使われるかもしれないインタフェースを定義しているに過ぎない。ほとんどのリソースは、セクション4で述べられているように、URI(Uniform Resource Identifier)によって識別されます。

> One design goal of HTTP is to separate resource identification from request semantics

> HTTPの設計目標の一つは、リソースの識別とリクエストのセマンティクスを分離することである。

[https://tex2e.github.io/rfc-translater/html/rfc9110.html](https://tex2e.github.io/rfc-translater/html/rfc9110.html)

> HTTP リクエストの対象は「リソース」と呼ばれ、その本質は細かく定義されていません。文書、写真、その他の何でもなりえます。それぞれのリソースは、リソースを特定するために HTTP の至るところで使用される Uniform Resource Identifier ([URI](https://developer.mozilla.org/ja/docs/Glossary/URI)) で特定されます。

[https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web](https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web)

リソースについて、そのものが持つ意味は調べると幅広く存在していますが、HTTPの文脈では「情報、データのこと」という認識でよいかと思います（詳細は以下の RFC3986 - Resourceにて）

## URI

リソースを識別するために使用されるURI (Uniform Resource Identifier) について。直訳すると

- Uniform - 統一された(形容詞）
- Resource - 資源（この文脈では情報、データ）
- Identifier - 識別子

となります。また、URIの仕様を定義しているRFC3986では、それぞれのフレーズについて以下のように説明されています。

### Uniform

> Uniformity provides several benefits. It allows different types of resource identifiers to be used in the same context, even when the mechanisms used to access those resources may differ. 
It allows uniform semantic interpretation of common syntactic conventions across different types of resource identifiers. It allows introduction of new types of resource identifiers without interfering with the way that existing identifiers are used. It allows the identifiers to be reused in many different contexts, thus permitting new applications or protocols to leverage a pre-existing, large, and widely used set of resource identifiers.

> 統一性にはいくつかの利点がある。たとえリソースにアクセスするための仕組みが異なっていても、 異なる種類のリソース識別子を同じ文脈で使うことができる。異なるタイプのリソース識別子間で、共通の構文規約の意味論的解釈を統一することができる。既存の識別子の使用方法を妨げることなく、新しいタイプのリソース識別子を導入できる。識別子をさまざまな文脈で再利用することができるため、新しいアプリケーションやプロトコルが、既存の大規模で広く使われているリソース識別子のセットを活用することができる。

URIはHTTP外の仕様であり、手段（プロトコル含む）が異なっていてもスキーム (http:// 等) の記述が異なっていれば同じような文脈で扱うことができます。

例として、同じくアプリケーション層のプロトコルであるFTPでURIを作成すると以下のようになります。
`ftp://hoge.fuga/piyo.txt` 

**”mailto:”、"file:" “javascript:” **などのように、プロトコルでないワードがスキームになることもありえます。

より調べていくと、アプリケーションを起動するためのスキームが存在しているようで、これについては今まで知りませんでした。設定されたスキームが記載されることでアプリケーションを起動させることもできるようで、自分自身これまで触れられてこなかったけどtoCアプリなどでは特に必須ですね（詳しくは以下を参照）

[https://qiita.com/nagaoyuriko/items/67c5e262f6e88cd88885#スキームって](https://qiita.com/nagaoyuriko/items/67c5e262f6e88cd88885#スキームって)

### Resource

> This specification does not limit the scope of what might be a resource; rather, the term "resource" is used in a general sense for whatever might be identified by a URI. Familiar examples include an electronic document, an image, a source of information with a consistent purpose (e.g., "today's weather report for Los Angeles"), a service (e.g., an HTTP-to-SMS gateway), and a collection of other resources. A resource is not necessarily accessible via the Internet; e.g., human beings, corporations, and bound books in a library can also be resources. Likewise, abstract concepts can be resources, such as the operators and operands of a mathematical equation, the types of a relationship (e.g., "parent" or "employee"), or numeric values (e.g., zero, one, and infinity).

> むしろ、"リソース "という用語は、URIによって識別されるかもしれないものなら何であれ、一般的な意味で使用される。身近な例としては、電子文書、画像、一貫した目的を持つ情報源(例えば "Today's weather report for Los Angeles")、サービス(例えばHTTP-to-SMSゲートウェイ)、他のリソースのコレクションなどがある。**リソースは必ずしもインターネット経由でアクセスできるとは限らない**。例えば、人間、企業、図書館にある製本された本もリソースになり得る。同様に、抽象的な概念もリソースとなり得る。例えば、数式の演算子やオペランド、関係のタイプ（例えば、「親」や「従業員」）、数値（例えば、ゼロ、1、無限大）などである。

後半部分では、「リソースは必ずしもインターネット経由でアクセスできるとは限らない」と記載されています。ここを踏まえると概念が広くなり非常に捉えるのが困難になりますが、URIの文脈の上ではインターネットの枠に限らず「取得できる情報」という理解の上で、HTTPでは多くの場合Webサーバー上からアクセスできる情報、という理解で切り分けるのが無難かと思います。

### Identifier

> An identifier embodies the information required to distinguish what is being identified from all other things within its scope of identification. Our use of the terms "identify" and "identifying" refer to this purpose of distinguishing one resource from all other resources, regardless of how that purpose is accomplished (e.g., by name, address, or context). These terms should not be mistaken as an assumption that an identifier defines or embodies the identity of what is referenced, though that may be the case for some identifiers. Nor should it be assumed that a system using URIs will access the resource identified: in many cases, URIs are used to denote resources without any intention that they be accessed. Likewise, the "one" resource identified might not be singular in nature (e.g., a resource might be a named set or a mapping that varies over time).

> 識別子は、識別されるものを、その識別の範囲内にある他のすべてのものから 区別するために必要な情報を具体化したものである。私たちが使用する "識別する"（"identify"）および "識別する"（"identification"）という用語は、その目的がどのように達成され るかにかかわらず（例えば、名前、住所、または文脈によって）、あるリソースを 他のすべてのリソースから区別するというこの目的を指す。これらの用語は、識別子が参照されるものの同一性を定義または体現しているという仮定と誤解してはならない。多くの場合、URIはアクセスされることを意図せずにリソースを示すために使われる。同様に、識別される「一つの」リソースは本質的に単一ではないかもしれない（例えば、リソースは名前付きセットかもしれないし、時間とともに変化するマッピングかもしれない）。


[https://tex2e.github.io/rfc-translater/html/rfc3986.html](https://tex2e.github.io/rfc-translater/html/rfc3986.html)

URL (Uniform Resource Locator) や URN (Uniform Resource Name) は、URIに内包されている言葉で、Identifierにあたる部分がLocator (場所を示している) か、Name (名前を示している) かによって用途が変わります。

参考

[https://ja.wikipedia.org/wiki/Uniform_Resource_Identifier](https://ja.wikipedia.org/wiki/Uniform_Resource_Identifier)

[https://qiita.com/Zuishin/items/3bd56117ab08ec2ec818](https://qiita.com/Zuishin/items/3bd56117ab08ec2ec818)

### URLとURIについて

Webのシステムを扱う限りURNが登場することはあまりないため、過去、URLとURIはほぼ同一のものとして扱われていました。

後にRFC3305でURLは慣用表現で、公式にURIが上位概念ということが述べられています。

> [要約] RFC 3305は、Uniform Resource Identifiers (URIs)、URLs（Uniform Resource Locators）、およびURNs（Uniform Resource Names）に関する概念の明確化と推奨事項を提供します。この文書の目的は、これらのリソース識別子の用途、相互関係、および適用場面についての理解を深めることにあります。特に、URIがURLとURNを包括する上位概念であること、URLがリソースの場所を指し示し、URNがリソースの名前を提供することを明確にします。このRFCは、Web技術やインターネット標準を扱う際の基礎となる文書であり、関連するRFCにはRFC 3986（URIの一般的な構文を定義）やRFC 2141（URN構文）などがあります。

[https://tex2e.github.io/rfc-translater/html/rfc3305.html](https://tex2e.github.io/rfc-translater/html/rfc3305.html)

ここでややこしいのが言語ごとの扱いの違いです。

- HTML5について議論するW3Cは、詳細な仕様やJavaScriptの標準化を行うにあたって「URL」を使用している
- Ruby, C#はURIという名前を使用している
- Go, Python, Node.jsはURLという名前を使っている
- JavaはURIとURI両方のクラスを備えている

参照 **「Real World HTTP 第2版 ―歴史とコードに学ぶインターネットとウェブ技術」**1.7 URL (Uniform Resource Locator)  より

[https://www.amazon.co.jp/Real-World-HTTP-第2版-―歴史とコードに学ぶインターネットとウェブ技術/dp/4873119030](https://www.amazon.co.jp/Real-World-HTTP-第2版-―歴史とコードに学ぶインターネットとウェブ技術/dp/4873119030)

具体的になぜこうなっているのかについての詳細な経緯は見つけられませんでしたが、時代の流れとそれぞれの解釈と共にこうなってしまったのかと想像しています……。ややこしいですね。

# HTTPのメソッド

HTTPでは、リソースに対して実行したいアクションを示す「リクエストメソッド」を定義しています。

RFC9110では、メソッドについて、以下のように記載がされています。

> All general-purpose servers MUST support the methods GET and HEAD.
All other methods are OPTIONAL.

> すべての汎用サーバーはGETとHEADメソッドをサポートしなければならない[MUST]。
> その他のメソッドはすべてオプション(OPTIONAL)である。

[https://www.rfc-editor.org/rfc/rfc9110#section-9.1](https://www.rfc-editor.org/rfc/rfc9110#section-9.1)

## リクエストメソッドのProperties

各リクエストメソッドの特徴としては以下の3つがあり、それぞれのメソッドによってこれらの異なった性質を持っています。

### Safe（安全）

リクエストメソッドが安全であるとは、「そのHTTPメソッドがサーバーの状態を変更しない」ということです。

一般的なHTTPメソッドの場合、以下が当てはまります。

- GET
- HEAD
- OPTIONS

「安全」なメソッドはすべて 「Idempotent（べき等）」ではありますが、逆に「べき等」なメソッドがすべて「安全」であるわけではありません。

> 安全なメソッドを意味通りに実装するのはサーバー上のアプリケーションの責任であり、 Apache, Nginx, IIS などのウェブサーバー自体は、そのことを強制できません。特に、アプリケーションは [`GET`](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/GET) リクエストによってサーバーの状態を変更することを許可してはいけません。

[https://developer.mozilla.org/ja/docs/Glossary/Safe/HTTP](https://developer.mozilla.org/ja/docs/Glossary/Safe/HTTP)

意味通りに実装するのはアプリケーション側の責任であり、適切な形でリクエストを送信するように実装を行わなければいけません。

### Idempotent（べき等）

べき等とは、「ある操作を1回行っても複数回行っても同じ結果が得られる」ことを表す言葉です。

HTTPメソッドの文脈でいうと、「サーバーが同じ状態であるとき、特定のリクエストに対して何回でも同じ結果が得られる」ということを表します。

適切に実装された以下のメソッドはべき等といえます。

- GET
- HEAD
- PUT
- DELETE

safe（安全）なメソッドはすべてべき等です。

また、POSTメソッドは基本的に常に同じ結果を起こすわけではないため、「べき等ではない」といった表現をします。

### Cacheable（キャッシュ可能）

リクエストメソッドによって、レスポンスをキャッシュすることが可能かどうかが定められています。キャッシュされたレスポンスは後で使用するためにクライアント側に格納され、サーバーへの同じ内容のリクエスト回数を節約します。

RFC9110の中では、以下のメソッドがキャッシュ可能であるとしています。

- GET
- HEAD
- POST

[https://www.rfc-editor.org/rfc/rfc9110#section-9.2.3](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.3)

しかし、実際にはPOSTをキャッシュすることはほとんどなく、ほとんどの場合はGETかHEADで実装されているとも記載されています。

## 各メソッドの詳細

ここからは先ほどのメソッドのpropertiesの内容も踏まえつつ、RFC9110で述べられている主要なメソッドについて取り上げていこうと思います。

### GET

特徴

- 安全 - 〇
- べき等 - 〇
- キャッシュ可能 - 〇

指定したリソースを取得します。

リクエストの本文 (Payload) は含みません。データをリクエストするために使用し、データは含めるべきではありません。

リクエスト成功時（ステータスコード200）のレスポンス本文には、リクエストしたURLに応じた安全かつ、べき等なリソースが返却されます。

> The GET method requests transfer of a current [selected representation](https://www.rfc-editor.org/rfc/rfc9110#selected.representation) for the [target resource](https://www.rfc-editor.org/rfc/rfc9110#target.resource). A successful response reflects the quality of "sameness" identified by the target URI ([Section 1.2.2](https://www.rfc-editor.org/rfc/rfc3986#section-1.2.2) of [[URI](https://www.rfc-editor.org/rfc/rfc9110#URI)]). Hence, retrieving identifiable information via HTTP is usually performed by making a GET request on an identifier associated with the potential for providing that information in a [200 (OK)](https://www.rfc-editor.org/rfc/rfc9110#status.200) response.

> GETメソッドは、ターゲットリソースに対して現在選択されている表現の転送(transfer)を 要求する。成功した応答は、ターゲットURIで特定される「同一性」の質を反映する([URI]のセ クション1.2.2)。したがって、HTTPで識別可能な情報を取り出すには、通常、200(OK)レスポンスで情報を提供する可能性のある識別子に関連するGETリクエストを行う。

リクエストパラメータに不適切な（秘匿するべきな）情報などがある場合や、キャッシュを考慮しないのであればPOSTを使用してリクエストを送信することもあります。

> When information retrieval is performed with a mechanism that constructs a target URI from user-provided information, such as the query fields of a form using GET, potentially sensitive data might be provided that would not be appropriate for disclosure within a URI (see [Section 17.9](https://www.rfc-editor.org/rfc/rfc9110#sensitive.information.in.uris)). In some cases, the data can be filtered or transformed such that it would not reveal such information. In others, particularly when there is no benefit from caching a response, using the POST method ([Section 9.3.3](https://www.rfc-editor.org/rfc/rfc9110#POST)) instead of GET can transmit such information in the request content rather than within the target URI.

> GETを使用したフォームのクエリフィールドのように、ユーザーが提供した 情報からターゲットURIを構築する仕組みで情報検索が実行されるとき、URI 内での開示には適切でない潜在的にセンシティブなデータが提供されるかもしれ ない(セクション17.9参照)。場合によっては、そのような情報を明らかにしないように、データを フィルタリングまたは変換することができる。他の場合、特に応答をキャッシュすることによる利益がない場合、 GETの代わりにPOSTメソッド(セクション9.3.3)を使うことで、そのような情報をターゲッ トURIの中ではなくリクエストコンテンツの中に送ることができる。

[https://www.rfc-editor.org/rfc/rfc9110#section-9.3.1](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.1)

### HEAD

特徴

- 安全 - 〇
- べき等 - 〇
- キャッシュ可能 - 〇

GETメソッドでリクエストされた際に返却されるヘッダーのみをリクエストします。リクエスト送信時はGETメソッドと特に変わりませんが、レスポンスには本文を含まず、ヘッダーのみを返却します。この時のヘッダーの内容は仕様としてはGETの時と同じであるべきとされています。

 

> The HEAD method is identical to GET except that the server **MUST NOT** send content in the response. HEAD is used to obtain metadata about the [selected representation](https://www.rfc-editor.org/rfc/rfc9110#selected.representation) without transferring its representation data, often for the sake of testing hypertext links or finding recent modifications.

> HEADメソッドは、サーバーがレスポンスにコンテンツを送ってはならない(MUST NOT)ことを除けば、GETと同じである。HEADは、ハイパーテキストのリンクをテストしたり、最近の変更を見つけるために、表現データを転送せずに、選択された表現に関するメタデータを取得するために使われる。

> The server **SHOULD** send the same header fields in response to a HEAD request as it would have sent if the request method had been GET. However, a server **MAY** omit header fields for which a value is determined only while generating the content. 

> サーバーはHEADリクエストに対する応答として、リクエストメソッドがGETの場 合と同じヘッダーフィールドを送るべきである[SHOULD]。しかしながら、サーバーはコンテンツを生成するときにのみ値が決定されるヘッダー フィールドを省略してもよい[MAY]。

[https://www.rfc-editor.org/rfc/rfc9110#section-9.3.2](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.2)

### POST

特徴

- 安全 - ×
- べき等 - ×
- キャッシュ可能 - △ （ほぼ使われない）

サーバーにデータを送信します。リクエスト本文の型は`Content-Type` ヘッダーで示されます。

RFC9110での定義では、以下のような機能をカバーする統一的なメソッドになるように設計されています。

- 既存のリソースの注釈
- 掲示板、ニュースグループ、メーリングリスト、又は同様の記事グループへの投稿
- サインアップモーダルからの新規ユーザーの追加
- フォームの送信結果などにおける、データを扱うプロセスへのデータブロックの受け渡し
- 追加操作によるデータベースの拡張

リクエスト成功時（ステータスコード200）は、レスポンス本文に処理結果が含まれた状態でデータが返却されます。

また、POSTリクエストが成功し、オリジンサーバー上に一つ以上のリソースが作成された場合は、ステータスコードとして201を返すべき、というように記載がされています。

> If one or more resources has been created on the origin server as a result of successfully processing a POST request, the origin server **SHOULD** send a [201 (Created)](https://www.rfc-editor.org/rfc/rfc9110#status.201) response containing a [Location](https://www.rfc-editor.org/rfc/rfc9110#field.location) header field that provides an identifier for the primary resource created ([Section 10.2.2](https://www.rfc-editor.org/rfc/rfc9110#field.location)) and a representation that describes the status of the request while referring to the new resource(s).

> POSTリクエストの処理に成功した結果、オリジンサーバー上に一つ以上のリソー スが作成された場合、オリジンサーバーは、作成されたプライマリリソース(セク ション10.2.2)の識別子と、新しいリソースを参照しながらリクエストのステータ スを記述する表現を提供するLocationヘッダーフィールドを含む201(Created)応 答を送るべきである[SHOULD]。

### PUT

特徴

- 安全 - ×
- べき等 - 〇
- キャッシュ可能 - ×

サーバーに対して、リソースの追加または上書き保存を指示するためのメソッドです。

リソースを追加するメソッドとしては同じような役割で「POST」がありますが、以下のような違いで分けられています。

- POST - 同じリクエストを送信しても、また新たにデータが作成される（場合がある）
    - べき等性がない
- PUT - 同じリクエストが送信された場合、同じ結果が返却される
    - 一度リソースを追加するリクエストを送信し、もう一度同じリクエストを送信しても、新たにデータが作成されることはなく、1回目のリクエストと同じ結果となる
    - べき等性がある

また、レスポンスコードに関してはPOSTと同じく、リソースを新たに作成した場合は201を返すように記載されていますが、こちらはSHOULDではなくMUST（しなければならない）として述べられています。

> If the target resource does not have a current representation and the PUT successfully creates one, then the origin server **MUST** inform the user agent by sending a [201 (Created)](https://datatracker.ietf.org/doc/html/rfc9110#status.201) response.

> ターゲットリソースが現在の表現を持たず、PUTがその表現作成に成功した場合、オリジンサーバーは201(Created)応答を送ることでユーザーエージェントに通知しなければならない[MUST]。

また、PUTの表現がターゲットリソースと矛盾している場合は、リソースを変更するなどで矛盾をなくすか、エラーメッセージでレスポンスを返却するべき、とも述べられています。

> An origin server **SHOULD** verify that the PUT representation is consistent with its configured constraints for the target resource. For example, if an origin server determines a resource's representation metadata based on the URI, then the origin server needs to ensure that the content received in a successful PUT request is consistent with that metadata. When a PUT representation is inconsistent with the target resource, the origin server **SHOULD** either make them consistent, by transforming the representation or changing the resource configuration, or respond with an appropriate error message containing sufficient information to explain why the representation is unsuitable. The [409 (Conflict)](https://datatracker.ietf.org/doc/html/rfc9110#status.409) or [415 (Unsupported Media Type)](https://datatracker.ietf.org/doc/html/rfc9110#status.415) status codes are suggested, with the latter being specific to constraints on [Content-Type](https://datatracker.ietf.org/doc/html/rfc9110#field.content-type) values.

> オリジンサーバーは、PUT表現がターゲットリソースに対して設定された制約と一致することを検証するべきである[SHOULD]。例えば、オリジンサーバーがURIに基づいてリソースの表現メタデータを決定する場合、オリジンサーバーは成功したPUTリクエストで受け取ったコンテンツがそのメタデータと一貫していることを保証する必要がある。**PUTの表現がターゲットリソースと矛盾している場合、オリジンサーバーは、表現を変換するかリソース設定を変更することでそれらを矛盾のないものにするか、表現が不適切である理由を説明する十分な情報を含む適切なエラーメッセージで応答するべきである[SHOULD]。409(Conflict)または415(Unsupported Media Type)ステータスコードが提案され、後者はContent-Type値の制約に固有である。**

### DELETE

特徴

- 安全 - ×
- べき等 - 〇
- キャッシュ可能 - ×

その名の通り、指定されたリソースを削除するためのメソッドです。

DELETEメソッドが正常に完了した場合、サーバーは次のようにレスポンスを送るべきであるとされています。

- 202 (Accepted) - 処理が成功する可能性は高いが、まだ成立はしていない場合
- 204 (No Content) - 処理が完了しており、サーバーが返すべきコンテンツが存在しない場合
- 200 (OK) - 処理が完了しており、レスポンスメッセージにステータスを表す表現を含んでいる場合

### CONNECT

特徴

- 安全 - ×
- べき等 - ×
- キャッシュ可能 - ×

リクエストしたリソースを用いて双方向の通信を開始します。具体的には、HTTPのプロトコル上に「他のプロトコルのパケットを流せる」ようにします。

用途としては、クライアントがプロキシ経由でHTTPS通信をする場合に使用します。

ここで何故そんなことをする必要があるのかというところですが、HTTPSを用いた通信では「通信の末端（リクエストを送信したクライアントと、リソースを保有するWebサーバー）以外に通信内容が分かってはいけない」という大前提があります。そしてその前提は、プロキシサーバーも例外ではありません。

プロキシを介し目的のリソースを保有するサーバーにアクセスする場合、プロキシはそのリクエストのペイロードを見て、リクエストするページのパス名（”/” 以下 = FQDN以降）をサーバーに渡して、プロキシに返ってきたレスポンスをクライアントに返す、という動きをします。

しかし、HTTPS (HTTP over TLS) の場合、ペイロードは「暗号化」されているのでプロキシサーバーには見ることができません。その際の通信に用いるのがCONNECTメソッドです。

CONNECTメソッドでは、以下のような手順で通信が行われます。

```javascript
// リクエスト内容
CONNECT www.example.com:443 HTTP/1.1
```

1. CONNECTメソッドを受け取ったプロキシは、宛先URI ( www.example.com) とHTTPコネクションを張ります（このコネクションはTCP/UDPレイヤーのコネクションとは別のもの）。コネクションが確立できればサーバーからステータスコード200が返却され、準備完了
2. クライアントからのTLS通信がサーバー ( www.example.com) と行われ、TLSセッションが張られます
3. HTTPS (HTTP over TLS) による通信が行われ、アプリケーションのデータの転送が行われる

つまり、プロキシ経由のHTTPS通信の実態は、CONNECTメソッドで確立されたコネクション上を流れるTLS上を流れるHTTP、となります。

（このメソッドに関しては、HTTPSについてまとめた項目で深掘りしていきたいところです）

参考

[https://realizeznsg.hatenablog.com/entry/2018/08/07/070000](https://realizeznsg.hatenablog.com/entry/2018/08/07/070000)

[https://poota.net/archives/652](https://poota.net/archives/652)

### OPTIONS

特徴

- 安全 - ○
- べき等 - 〇
- キャッシュ可能 - ×

このメソッドは指定されたURL又はサーバーの許可されている通信オプションをリクエストします。

例えば、以下のようなリクエストを送信した場合

```javascript
OPTIONS /index.html HTTP/1.1
Host: hogehoge.com
```

レスポンスに含まれるAllowヘッダは、そのリクエスト先が許可するメソッドの一覧です。

```javascript
HTTP/1.1 204 No Content
Allow: OPTIONS, GET, HEAD, POST
Cache-Control: max-age=604800
Date: Thu, 13 Oct 2016 11:45:00 GMT
Server: EOS (lax004/2813)
```

また、CORS (Cross-Origin Resource Sharing) では、実際のリクエストが送信される前に、サーバーがCORS要求を受付られるかどうかをOPTIONSメソッドで検証します。このOPTIONSで送信されるリクエストを「プリフライトリクエスト (Preflight Request) 」といいます。プリフライトリクエストはブラウザが自動的に発行するもので、通常はフロントエンド開発者が自分でそのようなリクエストを作成する必要はありません。

プリフライトリクエストは、以下3点のヘッダーをつけて送信がされます。

- Access-Control-Request-Method
    - 通信を許可してもらいたいメソッドをカンマ区切りで列挙
- Access-Control-Request-Headers
    - 許可してほしいヘッダーをカンマ区切りで列挙
- Origin
    - 通信元のWebページのドメイン名を指定

また、Cross-Originの通信のデフォルトではCookieを送受信しません。クライアントで送信することが設定済みのFetch API (credentials: ‘include’)  で、サーバーが許可する場合のみ送信します。

サーバーが通信を許可する場合は、以下のようなヘッダーを含めたレスポンスが返却されます

- Access-Control-Allow-Origin
    - 通信を許可するオリジン名
- Access-Control-Allow-Headers
    - 対象のURLに対して許容されるヘッダー名のリスト
- Access-Control-Allow-Credentials
    - Cookieなどの資格情報をサーバーが受け取るときに付与される。値としてはtrueのみが設定できる
- Access-Control-Expose-Headers
    - 許可ではなく、サーバーから返すレスポンスヘッダーのうち、スクリプトから参照できるヘッダー名の一覧を返す
- Access-Control-Max-Age
    - Cache-Controlを使ったキャッシュと同様に、キャッシュ可能秒数をサーバーからクライアントに伝達する

CORSまたはプリフライトリクエストに関しては掘り下げると別のトピックとなってくるので、ここでは一旦以上とします。

[https://developer.mozilla.org/ja/docs/Glossary/CORS](https://developer.mozilla.org/ja/docs/Glossary/CORS)

[https://developer.mozilla.org/ja/docs/Glossary/Preflight_request](https://developer.mozilla.org/ja/docs/Glossary/Preflight_request)

### TRACE

特徴

- 安全 - 〇
- べき等 - 〇
- キャッシュ可能 - ×

対象リソースまでのパスに沿ってメッセージのループバックテストを行い、便利なデバッグの仕組みを提供するメソッドです。

サーバーはTRACEメソッドを受け取ると、Content-Typeに message/http を設定しステータスコード200 (OK) を返します。

しかし実際はあまり使用されることは少ないようで、公開サーバーはオフにすべきという考え方もあるようです。

> TRACEメソッドは基本的には本番運用で[**利用者**](https://e-words.jp/w/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC.html)に提供する必要のない機能であり、過去にはこれを悪用する攻撃手法などもあったことから、[**公開サーバ**](https://e-words.jp/w/%E5%85%AC%E9%96%8B%E3%82%B5%E3%83%BC%E3%83%90.html)ではオフに設定すべきとする考え方もある。その場合、TRACEメソッドの[**リクエスト**](https://e-words.jp/w/%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88.html)に対しては「405 Method Not Allowed」（[**405エラー**](https://e-words.jp/w/405%E3%82%A8%E3%83%A9%E3%83%BC.html)）が返される。

[https://e-words.jp/w/TRACEメソッド.html](https://e-words.jp/w/TRACEメソッド.html)

## ちょっとした追記

### HTTP Method Registry

HTTPの仕様外でもメソッドは様々な形で標準化されており、定義されているメソッドについは、IANA (**Internet Assigned Numbers Authority**) によって、「HTTP Method Registry」として登録されているようです。

[https://www.iana.org/assignments/http-methods/http-methods.xhtml](https://www.iana.org/assignments/http-methods/http-methods.xhtml)

ここでは詳細は割愛します（よく見かけるものでPATCHなど）

### POSTのべき等性について

「HTTP POST べき等」などで検索すると、Restful APIの視点からPOSTメソッドも「べき等であるべき」という意見が散見されます。

べき等性を担保することで、リトライやロールバックが容易になり、利用者からより扱いやすいAPIになるのではということです。この点に関しては設計の視点なのでこの記事では深掘りはしませんが、「POSTはべき等ではない」という視点のみではなく、設計によっては「べき等であったほうがよい」という考え方でいるほうがよさそうです。

[https://zenn.dev/wasuwa/articles/252857e661aff8](https://zenn.dev/wasuwa/articles/252857e661aff8)

[https://munchkins-diary.hatenablog.com/entry/2019/11/14/151109](https://munchkins-diary.hatenablog.com/entry/2019/11/14/151109)

### POSTとPUTの使い分け

書籍「Webを支える技術」には以下のように書かれています。

> 　これには正解は存在しませんが、設計上の指針として次の事実があります。 POSTでリソースを作成する場合、クライアントはリソースのURIを指定できません。URIの決定権はサーバ側にあります。逆にPUTでリソースを作成する場合、リソースのURIはクライアントが決定します。 
　たとえばTwitterのようにつぶやきのURIをサーバ側で自動的に決定するWebサービスの場合は、POSTを用いるのが一般的です。逆に、Wikiのようにクライアントが決めたタイトルがそのままURIになるWebサービスの場合は、PUTを使うほうが適しているでしょう。ただしPUTの場合、リソースの上書きを避けるためにクライアントで事前にURIの存在をチェックしなければならないかもしれません。
　一般的に、クライアントがリソースのURIを決定できるということは、クライアントを作るプログラマがサーバの内部実装（URIにどの文字を許すのか、長さの制限はどれくらいかなど）を熟知していなければなりません。そのため、PUTのほうがどうしてもサーバとの結合が密になります。特別な理由がない限りは、リソースの作成はPOSTで行いURIもサーバ側で決定する、という設計が望ましいでしょう。

[https://www.amazon.co.jp/Webを支える技術-HTTP，URI，HTML，そしてREST-WEB-PRESS-plus-ebook/dp/B07JK7FZH2/ref=sr_1_1?adgrpid=102912038115&dib=eyJ2IjoiMSJ9._PS7ktSWdrsEJu5awJ6OfM5UIj6pUuQpgGUfICPNYI1yKHpr46mQRv4YCubtzaiKu_uZC9AHas1M3lUkVcLR5ikE1nnNQKQaAsuebmkQNNYwK3pQY8JWynOVoaGjrv5szZMtrQ_Eu--cdAkn_QN04HB7JyRT09Z6sd3PdOC1rpGNi4OgZE8WJfSnb4xS0-xJI7gsF-5ujWYETTfm3z3z0kbGsZbSoN7GuODBBn7MmGzues-SD5wQU8gfMZZSjzQZuKjSiFMhkH0Le0lE4mA1yaAtu9P5kcVgrHhPbKj-hh8._UFWirfweqP-fvGpWBhZcuMPaHS0B7tImO3X9Y_aN_w&dib_tag=se&gclid=CjwKCAiAxaCvBhBaEiwAvsLmWD-fo8DkqV5nFGgMaOsE8nqCn_3JEP56g6lh5tO5MmzGhYPzmi5OsxoC39kQAvD_BwE&hvadid=651192011668&hvdev=c&hvlocphy=1009540&hvnetw=g&hvqmt=e&hvrand=11143477949355093179&hvtargid=kwd-394859824714&hydadcr=21894_13456357&jp-ad-ap=0&keywords=web+を支える技術&qid=1709721377&sr=8-1](https://www.amazon.co.jp/Webを支える技術-HTTP，URI，HTML，そしてREST-WEB-PRESS-plus-ebook/dp/B07JK7FZH2/ref=sr_1_1?adgrpid=102912038115&dib=eyJ2IjoiMSJ9._PS7ktSWdrsEJu5awJ6OfM5UIj6pUuQpgGUfICPNYI1yKHpr46mQRv4YCubtzaiKu_uZC9AHas1M3lUkVcLR5ikE1nnNQKQaAsuebmkQNNYwK3pQY8JWynOVoaGjrv5szZMtrQ_Eu--cdAkn_QN04HB7JyRT09Z6sd3PdOC1rpGNi4OgZE8WJfSnb4xS0-xJI7gsF-5ujWYETTfm3z3z0kbGsZbSoN7GuODBBn7MmGzues-SD5wQU8gfMZZSjzQZuKjSiFMhkH0Le0lE4mA1yaAtu9P5kcVgrHhPbKj-hh8._UFWirfweqP-fvGpWBhZcuMPaHS0B7tImO3X9Y_aN_w&dib_tag=se&gclid=CjwKCAiAxaCvBhBaEiwAvsLmWD-fo8DkqV5nFGgMaOsE8nqCn_3JEP56g6lh5tO5MmzGhYPzmi5OsxoC39kQAvD_BwE&hvadid=651192011668&hvdev=c&hvlocphy=1009540&hvnetw=g&hvqmt=e&hvrand=11143477949355093179&hvtargid=kwd-394859824714&hydadcr=21894_13456357&jp-ad-ap=0&keywords=web+を支える技術&qid=1709721377&sr=8-1)

これもまた今回は設計に関するところを考察する記事ではないので引用にとどめますが、外部のAPIなどを使用したい際にサーバーの内部実装を知っていることはほとんどないと思うので、そうしたパブリック向けなAPIに関しては少なくともPUTを使用する場面はあまりないのでは、という所感です。

# さいごに

HTTP、さらっとまとめてアプリケーション層の他のプロトコルも掘り下げたいな〜と思ったけど、なめてました……

RFCとか諸々読み始めたらきりがない orz

# 参考

[https://www.rfc-editor.org/rfc/rfc9110](https://www.rfc-editor.org/rfc/rfc9110)

[https://developer.mozilla.org/ja/docs/Web/HTTP/Resources_and_specifications](https://developer.mozilla.org/ja/docs/Web/HTTP/Resources_and_specifications)

[https://developer.mozilla.org/ja/docs/Web/HTTP/Methods](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods)
