---
title: "WebIDLについて"
id: r7tkxul
public: false
publishedAt: 2025-08-01
editedAt: null
description: "WebIDLというものがなんなのかについて、概要から掘っていく記事です。 WebIDLとは ChatGPT先生の解答に出てきた「WebIDL」について少し掘り下げ。 > WebIDL は、ウェブアプリ"
tags:

---



WebIDLというものがなんなのかについて、概要から掘っていく記事です。

### WebIDLとは

ChatGPT先生の解答に出てきた「WebIDL」について少し掘り下げ。

> **WebIDL** は、ウェブアプリケーションプログラミングインターフェイス ([API](https://developer.mozilla.org/ja/docs/Glossary/API)) を構成する[データ型](https://developer.mozilla.org/ja/docs/Glossary/Type)、インターフェイス、[メソッド](https://developer.mozilla.org/ja/docs/Glossary/Method)、[プロパティ](https://developer.mozilla.org/ja/docs/Glossary/Property)、およびその他のコンポーネントを記述するために使用されるインターフェイス記述言語です。これは、特定のプログラミング言語に依存しないやや定式化された構文を使用しているため、API のコンポーネントを JavaScript 互換の構造にマップすることが可能な一方で、各 API を構築するために使用される基礎となるコードは、どの言語であっても最適に記述できます。

[https://developer.mozilla.org/ja/docs/Glossary/WebIDL](https://developer.mozilla.org/ja/docs/Glossary/WebIDL)

インターフェース定義言語「IDL (Interface Definition Langage) 」とは、ソフトウェアコンポーネント間のインターフェース記述を目的とするドメイン固有言語の総称である。

[https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E8%A8%98%E8%BF%B0%E8%A8%80%E8%AA%9E](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E8%A8%98%E8%BF%B0%E8%A8%80%E8%AA%9E)

主に、異なるプログラムやコンポーネント間で通信を行うためのインターフェースを定義するために使用される。

![](_images/image%2046.png)

引用: [https://upload.wikimedia.org/wikibooks/pt/5/5f/SID-CORBA-IDL.png](https://upload.wikimedia.org/wikibooks/pt/5/5f/SID-CORBA-IDL.png)

これらを踏まえて、WebIDLとはなにか。

> 実は、この記法は**[WebIDL](https://heycam.github.io/webidl/)**と呼ばれるものです。WebIDLはインターフェース・メソッド等を定義するための標準化された言語であり、Web関連のさまざまな仕様書におけるインターフェース定義記法を統一するために作成されました。仕様書の書き方を定義するメタ仕様という感じです。

[https://qiita.com/uhyo/items/a41cf51399de6f3fbd60#%E4%B8%8A%E7%B4%9A%E7%B7%A8%E3%82%A8%E3%83%A9%E3%83%BC%E3%82%92%E4%BB%95%E6%A7%98%E3%81%A7%E7%A2%BA%E3%81%8B%E3%82%81%E3%82%8B](https://qiita.com/uhyo/items/a41cf51399de6f3fbd60#%E4%B8%8A%E7%B4%9A%E7%B7%A8%E3%82%A8%E3%83%A9%E3%83%BC%E3%82%92%E4%BB%95%E6%A7%98%E3%81%A7%E7%A2%BA%E3%81%8B%E3%82%81%E3%82%8B)

改めてMDNを覗いてみると、このような記述があった。

> IDL は ***Interface Definition Language*** の略で、 API を記述するために設計されています。広いコンピューターの世界では、 IDL はいくつかの種類に分かれています。ブラウザーの世界では、私たちが使っている IDL は *WebIDL* と呼ばれています。 WebIDL には、 WebIDL 仕様書で規定されているものと、ブラウザーに実装されているものの 2 種類があります。仕様書は標準的なリファレンスで、ブラウザーの WebIDL は特定のブラウザーで実際に実装されているものを記述し、アノテーション、非標準の要素に関する情報、 IDL 仕様に対するブラウザー固有の拡張などの追加事項を含んでいます。

[https://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Howto/Write_an_api_reference/Information_contained_in_a_WebIDL_file](https://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Howto/Write_an_api_reference/Information_contained_in_a_WebIDL_file)

読み進めていくと、どうやら定義ファイルは各ブラウザエンジンによってまとめられている箇所があるらしい。

Gecko (Firefoxのブラウザエンジン) のWebIDL定義

[https://searchfox.org/mozilla-central/source/dom/webidl/](https://searchfox.org/mozilla-central/source/dom/webidl/)

> Chromium では、ソースコードの [`renderer/`](https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/) ディレクトリーのサブツリーである [`core/`](https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/) と [`modules/`](https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/modules/) の 2 ヶ所に配置されます。

[http://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Howto/Write_an_api_reference/Information_contained_in_a_WebIDL_file#webidl_%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E5%A0%B4%E6%89%80](http://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Howto/Write_an_api_reference/Information_contained_in_a_WebIDL_file#webidl_%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E5%A0%B4%E6%89%80)

ChrominiumのWebIDLについて説明している箇所では、以下のように説明されている。

> Web interfaces – exposed as JavaScript objects – are generally specified in [Web IDL](http://heycam.github.io/webidl/) (Interface Definition Language), a declarative language (sometimes written without the space as WebIDL). This is the language used in standard specifications, and Blink uses IDL files to specify the interface and generate JavaScript bindings (formally, C++ code that the V8 JavaScript virtual machine uses to call Blink itself). [Web IDL in Blink](https://www.chromium.org/blink/webidl) is close to the standard, and the resulting bindings use standard conventions to call Blink code, but there are additional features to specify implementation details, primarily [Blink IDL extended attributes](https://chromium.googlesource.com/chromium/src/+/HEAD/third_party/blink/renderer/bindings/IDLExtendedAttributes.md).

> JavaScriptオブジェクトとして公開されるWebインターフェースは、一般的に宣言型言語であるWeb IDL（Interface Definition Language）で指定される（スペースなしでWebIDLと表記されることもある）。これは標準仕様で使われる言語で、BlinkはIDLファイルを使ってインターフェースを指定し、JavaScriptバインディング（正式には、V8 JavaScript仮想マシンがBlink自身を呼び出すために使うC++コード）を生成します。BlinkのWeb IDLは標準に近く、生成されるバインディングはBlinkコードを呼び出すために標準的な規約を使用しますが、実装の詳細を指定するための追加機能（主にBlink IDL拡張属性）があります。

[https://www.chromium.org/developers/web-idl-interfaces/](https://www.chromium.org/developers/web-idl-interfaces/)

ここで「Blink」という知らない概念が出てきたので、これについても掘り下げてみようと思う。

### Blinkとは

> Blink は、HTML、CSS、JavaScript、動画、画像など、必要なすべてのリソースを収集してレンダリング プロセスを開始します。これらのリソースを取得するために、Blink は Chromium と基盤となるオペレーティング システムのネットワーク スタックとのやり取りを管理します。

[https://developer.chrome.com/docs/web-platform/blink?hl=ja](https://developer.chrome.com/docs/web-platform/blink?hl=ja)

> Make the Web the premier platform for experiencing the world’s information and deliver the world’s best implementation of the Web platform.

> ウェブを世界の情報を体験できる最高のプラットフォームとし、世界最高のウェブ・プラットフォームの実装を実現する。

Missionより

[https://www.chromium.org/blink/](https://www.chromium.org/blink/)

Chrominiumプロジェクトが保守しているオープンソースの「レンダリングエンジン」がBlinkである。

> Blink は、HTML、CSS、JavaScript、動画、画像など、必要なすべてのリソースを収集してレンダリング プロセスを開始します。これらのリソースを取得するために、Blink は Chromium と基盤となるオペレーティング システムのネットワーク スタックとのやり取りを管理します。

> CSS と HTML が読み込まれるとすぐに、Blink はテキスト形式のコードから処理可能な表現に変換します。これを**解析**と呼びます。JavaScript も解析してから実行する必要があります。

[https://developer.chrome.com/docs/web-platform/blink?hl=ja](https://developer.chrome.com/docs/web-platform/blink?hl=ja)

BlinkはJavaScriptコードとWebAssemblyコードを解析するために、V8エンジンを使用している。

V8エンジンとは

> V8は、C++で書かれたGoogleのオープンソースの高性能JavaScriptおよびWebAssemblyエンジンである。ChromeやNode.jsなどで使用されている。ECMAScriptとWebAssemblyを実装し、x64、IA-32、ARMプロセッサを使用するWindows、macOS、Linuxシステム上で動作する。V8はあらゆるC++アプリケーションに組み込むことができる。

[https://v8.dev/](https://v8.dev/)

V8はEcmaScriptで定められた仕様に準拠している。

つまり、

[https://nhiroki.jp/2021/09/04/talk-browser-architecture](https://nhiroki.jp/2021/09/04/talk-browser-architecture)

# 参考

[https://redj.hatenablog.com/entry/2023/02/25/154617](https://redj.hatenablog.com/entry/2023/02/25/154617)

[https://nhiroki.jp/2021/05/06/resource-loading-apis](https://nhiroki.jp/2021/05/06/resource-loading-apis)

[https://triple-underscore.github.io/WebIDL-ja.html](https://triple-underscore.github.io/WebIDL-ja.html)

[https://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Howto/Write_an_api_reference/Information_contained_in_a_WebIDL_file](https://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Howto/Write_an_api_reference/Information_contained_in_a_WebIDL_file)

[https://www.slideshare.net/slideshow/webidl/57139164](https://www.slideshare.net/slideshow/webidl/57139164)

[https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/](https://www.w3.org/TR/2016/REC-WebIDL-1-20161215/)