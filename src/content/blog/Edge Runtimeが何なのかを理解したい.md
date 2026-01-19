---
title: "Edge Runtimeが何なのかを理解したい"
id: 5gna0b8
public: true
publishedAt: 2023-11-29
editedAt: null
description: "Next.jsでmiddlewareを使用するにあたって、middlewareはEdge Runtimeで動くのでnodeの感覚でライブラリ使ったらいろいろ動かなかったりした。 そもそもEdge Ru"
tags:
  - JavaScript
  - Next.js
---



Next.jsでmiddlewareを使用するにあたって、middlewareはEdge Runtimeで動くのでnodeの感覚でライブラリ使ったらいろいろ動かなかったりした。

そもそもEdge Runtimeってなんなん？ ということが言語化して説明できなかったので、自分的な理解を合わせてアウトプットしてみる。

## The Edge Runtime

vercelのドキュメントにいろいろと書いてある。

[https://edge-runtime.vercel.app/](https://edge-runtime.vercel.app/)

> The Edge Runtime is designed to help framework authors adopt edge computing and provide open-source tooling built on Web standards. It’s designed to be integrated into frameworks (like Next.js) and not for usage in application code. This runtime is purposefully minimal and designed for security and speed.

> Edge Runtimeは、フレームワークの作者がエッジコンピューティングを採用し、Web標準に基づいたオープンソースのツールを提供できるように設計されている。これは（Next.jsのような）フレームワークに統合されるように設計されており、アプリケーションコードで使用することはできません。このランタイムは、意図的に最小化され、セキュリティとスピードのために設計されています。

わからんこと

- エッジコンピューティング

> When your framework is built on the Edge Runtime, it runs everywhere Node.js does. When deployed to infrastructure like Vercel, frameworks like Next.js can automatically provision the optimal infrastructure for you.

> フレームワークをEdge Runtime上でビルドすると、Node.jsが動作する場所ならどこでも動作します。Vercelのようなインフラストラクチャにデプロイすると、Next.jsのようなフレームワークが自動的に最適なインフラストラクチャをプロビジョニングします。

> The Edge Runtime is a subset of standard Web APIs, giving you compatibility and interoperability with the highest number of environments. The project is designed to be compliant with standards developed by [WinterCG(opens in a new tab)](https://wintercg.org/) - a community group between Vercel, Cloudflare, Deno, Shopify, and more. The term “Edge” refers to the orientation toward instant serverless compute environments and not a specific set of locations.

> Edgeランタイムは標準的なWeb APIのサブセットであり、最も多くの環境との互換性と相互運用性を提供します。このプロジェクトは、Vercel、Cloudflare、Deno、ShopifyなどのコミュニティグループであるWinterCG（新しいタブで開く）によって開発された標準に準拠するように設計されています。Edge "という用語は、即座のサーバーレス・コンピュート環境を志向することを意味し、特定の場所の集合を意味するものではない。

## まずわからん言葉から整理

### エッジコンピューティングについて

> エッジコンピューティングとは、利用者側の端末やその近くに設置するサーバーなどのネットワーク周縁（エッジ）部分でデータを処理するコンピューティング手法です。

[https://www.nec-solutioninnovators.co.jp/sp/contents/column/20220225_edge-computing.html](https://www.nec-solutioninnovators.co.jp/sp/contents/column/20220225_edge-computing.html)

> エッジコンピューティングとは、遅延と帯域幅の消費を低減するために、演算処理を可能な限りデータのソースに近づけることに焦点を当てたネットワークの基本方針です。簡単に言えば、エッジコンピューティングとは、[クラウド](https://www.cloudflare.com/learning/cloud/what-is-the-cloud/)で実行するプロセスを減らし、それらのプロセスをユーザーのコンピューター、[IoTデバイス](https://www.cloudflare.com/learning/ddos/glossary/internet-of-things-iot/)や[エッジサーバー](https://www.cloudflare.com/learning/cdn/glossary/edge-server/)などローカルな場所に移動することを意味します。ネットワークのエッジにコンピューティング機能を移動すると、[クライアントとサーバー](https://www.cloudflare.com/learning/serverless/glossary/client-side-vs-server-side/)間で発生する長距離通信の量が最小限に抑えられます。

[https://www.cloudflare.com/ja-jp/learning/serverless/glossary/what-is-edge-computing/](https://www.cloudflare.com/ja-jp/learning/serverless/glossary/what-is-edge-computing/)

> エッジは ATM のようなものです。どこにいても必ず近くに ATM があるため、当然のようにすばやく簡単に現金を引き出すことができます。ユーザーやデバイスに近い場所でデータが処理されるため、レイテンシーが低減され、どこからデータにアクセスしても、すばやくスムーズにアクセスできます。

[https://www.akamai.com/ja/glossary/what-is-edge-computing](https://www.akamai.com/ja/glossary/what-is-edge-computing)

要するに、ユーザーのデバイスから物理的に近い部分で行う処理を指している。

今まで遠く離れたサーバーで行なってきた処理を、できるだけユーザーのコンピューター側やそれに近いサーバーに処理を移動する、と解釈。

エッジコンピューティングの概念はWebアプリケーション開発に限定されず、IoTなどいろいろな領域にも適用される。

### ネットワークエッジについて

> インターネットデバイスの場合、ネットワークエッジは、デバイス、またはデバイスを含むローカルネットワークがインターネットと通信する場所を指します。エッジは少しあいまいな用語です。たとえば、ユーザーのコンピューターまたはIoTカメラ内のプロセッサはネットワークエッジと見なされますが、ユーザーのルーター、ISP、またはローカルエッジサーバーもまた、エッジと見なされるためです。重要なことは、通信し合うデバイス間の距離が非常に長い[配信元サーバー](https://www.cloudflare.com/learning/cdn/glossary/origin-server/)やクラウドサーバーとは異なり、ネットワークのエッジが地理的にデバイスに近いことです。

[https://www.cloudflare.com/ja-jp/learning/serverless/glossary/what-is-edge-computing/](https://www.cloudflare.com/ja-jp/learning/serverless/glossary/what-is-edge-computing/)

遠く離れたAmazonのデータセンターに通信するよりも、ユーザーのルーターとかローカル環境に処理を置いて物理的に距離を縮めてたらそれはエッジ環境だぜ！ その距離感の定義はあいまいやけどな！

みたいなイメージで理解できた。

### エッジコンピューティングの利点

1. コスト削減

例えば監視カメラが継続的にクラウドサーバーに接続し、処理を行うような構成をとると、転送される大量の映像によってかなりの帯域幅を消費する。これをネットワークエッジによって、モーションを検知した場合などの必要に応じてクラウドサーバーに送信することで、帯域幅の使用が大幅に節約される。

2. パフォーマンス

実際の処理を行う場所が物理的に近くなるので、通信間のレイテンシ（遅延）も短縮できる。

Webアプリケーションであればユーザー操作のたびに外部サーバーに通信を行うとレイテンシが発生するが、ネットワークエッジによって処理を行うことで短縮することができる。

### エッジコンピューティングの欠点

3. 攻撃ベクトルが増加する

エッジサーバーや内蔵方コンピュータ付きIoTデバイスなど、攻撃できる対象が単純に増える。

4. より多くのローカルハードウェアが必要

例えば動画のモーション検出アルゴリズムなどの実行にはより処理能力の高いコンピュータが必要。これをエッジ環境に用意する必要がある。これに対応する方法として、Cloudflare Workersなどのエッジサーバーを有効活用する、がある。

## CDN（コンテンツ・デリバリー・ネットワーク）について

エッジコンピューティングについて調べているうちに、CDNとの違いはなんなんや？ となったのでCDNについても改めて理解する。

> コンテンツ配信ネットワーク (CDN) は、相互接続されたサーバーのネットワークであり、データ量の多いアプリケーションのウェブページのロードを高速化します。CDN は、コンテンツ配信ネットワーク (Content Delivery Network または Content Distribution Network) の略です。ユーザーがウェブサイトにアクセスすると、そのウェブサイトのサーバーからのデータは、ユーザーのコンピュータに到達するためにインターネット上を移動する必要があります。ユーザーがそのサーバーから遠く離れた場所にいる場合、動画やウェブサイトの画像などの大きなファイルをロードするのに長い時間がかかります。これに代えて、ウェブサイトのコンテンツは、地理的にユーザーに近い CDN サーバーに保存され、ユーザーのコンピュータにはるかに速く到達します。

[https://aws.amazon.com/jp/what-is/cdn/](https://aws.amazon.com/jp/what-is/cdn/)

レイテンシを低減する、帯域幅の消費を減らす、という意味合いでやろうとしていることは同じ。

CDNサーバーはクライアントとWebサーバーの中間に介在し管理するため、Webサーバーのトラフィックも減らすことができる。

CDNでは、静的コンテンツと動的コンテンツの2種類が配信できる。

特に静的データはCDNでの保存に最適。

### CDNとエッジコンピューティングはどう違うのか

> 「エッジ」の意味を拡大解釈すれば、CDN もエッジコンピューティングの一形態と考えられます。CDN は元来、キャッシュされたデータを保存するという目的のために、従来のサーバーをもとに構築されたものです。しかし、現在の世界では、CDN をすでに使用していて、CDN のベンダーが（CDN とのやり取りのために）コードの記述を許可しているのであれば、それはもはや CDN エッジコンピューティングです。エッジネットワークは、従来のサーバーからスマートフォンや IoT デバイスに至るまで、あらゆるデバイスで動作し、データを処理したり保存したりすることができます。

[https://www.akamai.com/ja/glossary/what-is-edge-computing](https://www.akamai.com/ja/glossary/what-is-edge-computing)

ChatGPT（Web Application Sensei）に聞いた

---

CDNとエッジコンピューティングについての意味の違いについて教えてください。
また、歴史的文脈からなぜこのような言葉の使われ方に違いが表れているかについて解説して下さい。

![](https://files.oaiusercontent.com/file-PsYfyfa2vTtggrTCeyqn52ya?se=2123-10-17T13%3A22%3A41Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dc83c3535-5e70-4353-b451-a25406d47d8a.png&sig=izU4UoaRzSeRbnyoqCkLIXMY%2BpN41uKbSNKqiLdLiMw%3D)

**Web Application Sensei**

CDN（Content Delivery Network）とエッジコンピューティングは似て非なる概念ですが、インターネットの発展とともに進化してきました。それぞれの意味と歴史的文脈からの違いについて説明します。

### **CDN（Content Delivery Network）**

5. **意味**: CDNは、コンテンツ（ウェブページ、画像、動画など）を地理的に分散配置されたサーバーネットワークにキャッシュし、ユーザーがアクセスした際に最も近いサーバーからコンテンツを迅速に提供するシステムです。
6. **目的**: CDNの主な目的は、コンテンツの配信を高速化し、サーバーの負荷を軽減することです。これにより、ユーザーエクスペリエンスが向上し、ウェブサイトのパフォーマンスが改善されます。
7. **歴史的文脈**: CDNは1990年代に登場し、インターネットのコンテンツ配信を効率化するために発展しました。当時、ユーザー数の増加とコンテンツの肥大化により、中央集中型のサーバーではレスポンスタイムや帯域幅に問題が発生していました。CDNはこれらの問題を解決するために開発されました。

### **エッジコンピューティング**

8. **意味**: エッジコンピューティングは、データ処理をクラウドの中心部ではなく、データの発生源に近い「エッジ」で行うアプローチです。これにより、レイテンシが削減され、リアルタイム処理が可能になります。
9. **目的**: エッジコンピューティングの目的は、レイテンシの低減、帯域幅の使用効率化、データプライバシーの向上などです。特に、IoTデバイスやモバイルデバイスなど、大量のデータを生成する環境で有効です。
10. **歴史的文脈**: エッジコンピューティングは、クラウドコンピューティングの進化とともに登場しました。クラウドの中央集中型のデータ処理では、IoTの普及により発生する膨大なデータを効率的に処理できないという課題が浮上しています。エッジコンピューティングは、このような状況下でのデータ処理の効率化とレイテンシの低減を目指しています。

### **CDNとエッジコンピューティングの違い**

- **焦点の違い**: CDNはコンテンツ配信の高速化に重点を置いているのに対し、エッジコンピューティングはデータ処理の高速化と効率化に重点を置いています。
- **技術の進化**: CDNはインターネット初期のコンテンツ配信の問題に対処するために発展したのに対し、エッジコンピューティングはクラウドコンピューティングとIoTの進化に伴って生まれました。

CDNとエッジコンピューティングは、インターネットの成長とともに発展してきた技術です。それぞれがネットワークとデータ処理の効率化に異なるアプローチを提供しており、現代のインターネットインフラストラクチャにおいて重要な役割を果たしています。

---

調べてたら「CDNエッジコンピューティング」なんて言葉もあったりするので、一旦このあたりの明確な理解は別の記事に回した方が良さそう。一旦は、焦点としてCDNはその名の通りコンテンツ配信に目を向けた分散コンピューティングの仕組みを表す言葉で、エッジコンピューティングは処理と負荷軽減そのものに焦点を当てた、ある意味CDNより大きな視点で見た言葉、という理解。この辺りはなんかいろいろと聞いてみたい。

[https://www.kosho.org/blog/cdn/edge-computing/](https://www.kosho.org/blog/cdn/edge-computing/)


## つまり、Edge Runtimeとは（まとめたいがまとまってない）

Vercelのドキュメントから読み取る限りでは（ほぼそのまま持ってきた感があるが）、

エッジコンピューティングの考え方を採用し、Web標準のオープンソースのツールを提供できるように設計されたランタイム（動作させるときに必要なプログラムの部品群）を指す。

アプリケーションコードでは使用不可。

Edgeランタイムそのものは**標準的なWeb APIのサブセット**で、様々な環境の互換性と相互運用性を持つ。

一言で、「これだ」という言葉を探していたけれど、Cloudflare WorkersやVercelなど、各環境によって意味合いとか考え方は異なっているんではないかと思われる。

![](_images/Untitled%2056.png)

[https://x.com/__syumai/status/1603551458133430272?s=20](https://x.com/__syumai/status/1603551458133430272?s=20)

![](_images/Untitled%2057.png)

[https://twitter.com/sumiren_t/status/1641088601659420672](https://twitter.com/sumiren_t/status/1641088601659420672)

> ミドルウェアが必ずしもEdge Functionであるとは限らず、Edge Functionが必ずしもミドルウェアであるとは限らない。
Vercelにデプロイする場合、Edge Functionで実行されるコードはmiddlewareだけ

[https://github.com/vercel/next.js/issues/30674#issuecomment-955805178](https://github.com/vercel/next.js/issues/30674#issuecomment-955805178)

Vercelで、Edge Functionは以下のようにEdge Runtimeで動作する関数のことを指している

> Edge Functions use Vercel's [Edge Runtime](https://vercel.com/docs/functions/edge-functions/edge-runtime), which is built on the same high-performance [V8 JavaScript](https://developers.google.com/apps-script/guides/v8-runtime?hl=en) and WebAssembly engine used by the Chrome browser.

> Edge Functionsは、Chromeブラウザで使用されているのと同じ高性能なV8 JavaScriptおよびWebAssemblyエンジンをベースに構築されたVercelのEdgeランタイムを使用しています。

[https://vercel.com/docs/functions/edge-functions#how-edge-functions-work](https://vercel.com/docs/functions/edge-functions#how-edge-functions-work)

## つまり、Edge Runtimeとは（無理やりまとめてみる）

Vercelにおいては、V8JavaScript & WebAssemblyエンジンをベースに構築されたruntime。

コンテナや仮想マシンを必要としない分離された環境で関数（Edge Functions）を実行できる。

Edge Runtimeは上記のように分離された環境下であるため様々な面で機能が制約されるが、同時に軽量化も維持される。

[https://vercel.com/docs/functions/edge-functions#how-edge-functions-work](https://vercel.com/docs/functions/edge-functions#how-edge-functions-work)

Edge Middleware

middleware.tsとして記述した関数ではVercelではEdge Middlewareとしてブラウザから最も近い距離で実行される。

[https://vercel.com/docs/functions/edge-middleware#](https://vercel.com/docs/functions/edge-middleware#)


## さいごに

めちゃくちゃ個人メモ感満載の記事になった…

Vercelのドキュメント読んでると、本当にいろんなことをよしなにやってくれているんだなと思う

[https://vercel.com/docs/edge-network/overview](https://vercel.com/docs/edge-network/overview)

## 参考

[https://yusukebe.com/posts/2021/functions-at-edge/](https://yusukebe.com/posts/2021/functions-at-edge/)

[https://www.publickey1.jp/blog/23/cdnjspr.html](https://www.publickey1.jp/blog/23/cdnjspr.html)