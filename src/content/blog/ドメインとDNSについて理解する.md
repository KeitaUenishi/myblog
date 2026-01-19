---
title: "ドメインとDNSについて理解する"
id: t35h93y
public: true
publishedAt: 2024-04-30
editedAt: null
description: "ドメイン名について ドメイン名はインターネット上で使われるユニークな名前で、原則として取得は「早い者勝ち」です。 IPアドレスは人間にとって覚えにくいため、DNSがあることによってインターネット上の住"
tags:
  - network
  - Web
---



# ドメイン名について

ドメイン名はインターネット上で使われるユニークな名前で、原則として取得は「早い者勝ち」です。

IPアドレスは人間にとって覚えにくいため、DNSがあることによってインターネット上の住所を “[https://example.com](https://example.com/)” などといった覚えやすい名前でアクセスすることができるようになります。

ピリオドで区切られたそれぞれの文字列は「ラベル」と呼ばれ、63文字以内でなければなりません。またドメイン名全体の長さも253文字以内と定められています。

## ドメイン名の構造

ドメイン名はホスト名や組織名を識別するために階層構造がとられており、英字がピリオドによって繋がれています。

例として、”www.example.co.jp” のようなドメインがあった場合、これは以下の構造に分けられます

- jp → トップレベルドメイン (TLD)
    - 国別、商用、地域などを表すドメイン
    - us (アメリカ)  com (商用) など
- co. → 第2レベルドメイン (SLD)
    - 組織の種類を表すドメイン
    - co (一般企業)  ac (教育機関)  go (政府機関)  など
- example. → 第3レベルドメイン
    - 具体的な企業名や組織名を表すドメイン
    - yahoo  google  ntt  など
- www. → 第4レベルドメイン
    - 「ホスト名」に位置づけられるドメイン。一般的にWebサーバーであれば「www」として、ftpサーバーであれば「ftp」とすることが多い。

第4レベルドメインについては、昨今ではほとんどのURLがWeb上で公開されているため、省略されていることもあります（SEOの観点から、省略しているか否か、は統一するべきであるといわれている）。

[https://gmotech.jp/semlabo/seo/blog/www-difference/](https://gmotech.jp/semlabo/seo/blog/www-difference/)

以下はMDNより引用です。

> **はい**、ひとつを選択して維持しなければなりません。基準となる場所に応じてどちらを選択するかはあなた次第ですが、どちらかを選択したら、それを維持してください。それにより、ユーザーや検索エンジンから見てウェブサイトが首尾一貫したものになります。

**いいえ**、二つ持つことができます。どちらが公式なドメインであるかについて、一貫性を持って矛盾しないことが重要です。**この公式なドメインは*****正規名*****と呼ばれます。** すべての絶対パスリンクで正規名を使用するべきです。しかし、それでも他のドメインを機能させることができます。

[https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/Choosing_between_www_and_non-www_URLs#では、自身のウェブサイトでどちらかを選択しなければならないのか](https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/Choosing_between_www_and_non-www_URLs#では、自身のウェブサイトでどちらかを選択しなければならないのか)

ホスト名（第4レベルドメイン）を含まない箇所を一般的に「ドメイン名」と呼び、ホスト名まで含めたものをFQDN（完全修飾ドメイン名）と呼びます。

ドメイン名はルート「. 」を起点としたツリー構造となっており、以下のような形で一意性を保証しています。

![](_images/Untitled%2076.png)

参照: [https://lpi.or.jp/lpic_all/linux/network/network07.shtml](https://lpi.or.jp/lpic_all/linux/network/network07.shtml)

ルート「.」はドメイン名の中では基本的に省略されていますが、実際には”www.example.co.jp”であれば”www.example.co.jp.” のように最後尾に記載されます。

## ドメイン名の種類

### gTLD (Generic Top Level Domain : 分野別トップレベルドメイン)

利用者の居住国などに関わらず、誰でも取得できるドメインです。代表的なものに「.com」「.net」「.info」などがあり、ICANN (Internet Corporation for Assigned Names and Numbers) によって管理されています。

当初は「.com」「.net」「.org」「.edu」「.gov」「.mil」「.int」の7つしか存在していませんでしたが、その後も申請にと審査によって少しずつ追加されていきました。

2012年にはICANNが「新gTLDプログラム」として、新しいgTLDの導入プロセスを大幅に緩和する形で申請受付が行われました。この受付プログラムの申請件数は1930件にのぼり、2013年以降は承認されたものから随時運用が開始されていきました。

以下より現在登録されているTLDの一覧を確認できます。

※ 「generic」で検索したところ、1249件が当てはまるようでした。

[https://www.iana.org/domains/root/db](https://www.iana.org/domains/root/db)

また、次回の新gTLDの申請受付はICANNより以下のように記されています。

> The next application submission period for new gTLDs is expected to open in Q2 2026. A crucial driver of the timeline is the [Policy Implementation](https://docs.google.com/document/d/1Ehgzod5CBDKjbVGz-d7itOLQNs-2aXP2MvE6w825Cng/edit#heading=h.dxu0vgavhlud) work, culminating in completion of the Applicant Guidebook, which is estimated to conclude in May 2025. Once that work has been completed, ICANN estimates it will take approximately one year to operationalize the process and open the application submission period.

> 新gTLDの次回の申請受付は2026年第2四半期に開始される予定です。このスケジュールの重要な原動力は、申請者ガイドブックの完成を頂点とするポリシーの実施作業であり、この作業は2025年5月に完了すると見積もられています。この作業が完了した後、プロセスを運用し、申請受付を開始するまでに約1年かかるとICANNは予測しています。

[https://newgtlds.icann.org/en/announcements-and-media/announcement-06nov23-en](https://newgtlds.icann.org/en/announcements-and-media/announcement-06nov23-en)

### ccTLD (Contry Code Top Level Domain : 国別コードトップレベルドメイン)

各国・地域に割り当てられたTLDです。[ISO3166 ](https://www.iso.org/iso-3166-country-codes.html)で規定されている2文字の国コードを原則として使用しています。**「.jp」「.au」「.us」**などが挙げられます。

ちなみに、ccTLDは南極にもあるらしく、「.aq」が割り当てられています。これについてはICANNが選定しているというわけではなく、ISO3166で定義されているためのようです。

> ccTLDとして使われるjpやusなどの文字列はIANAが決めるのではなく、国際標準化機構（ISO）が定めた「ISO3166-1 alpha-2」という国際規格に従って割り当てると決められています。ISO3166-1 alpha-2は国や地域の名称を2文字で示すための規格（定義）で、IANAはこれをそのままccTLDの文字列に採用しているのです。

[https://xtech.nikkei.com/it/atcl/column/14/228621/032700013/](https://xtech.nikkei.com/it/atcl/column/14/228621/032700013/)

基本的には国・地域に限定されているものがほとんどですが、中にはお金さえ払えばだれでも取得できるものも存在します。

**「.tv」**

南太平洋の島国ツバルに割り振られたccTLDで、2000年にアメリカのdotTV社に5000万ドルで売却されました。この売却益によってツバルは国連加盟を果たすことができたそうです。tvや映像関連のサービスなどで多く使用されています (abema.tvなど) 。

「.to」

トンガ王国のccTLDで、外貨獲得のため一般公開されており人気の高いドメインです。

### **Infrastructure TLD**

インターネットインフラ用のトップレベルドメインのことで、「.arpa」があります。一般ユーザーが登録できるものではありません。

IPアドレスの逆引きを行う場合や、インターネット電話で電話番号とURIを対応づける際に用いられます。

# DNSとは

DNSとはDomain Name Systemの略称で、ドメイン名（コンピュータを識別する名称）をIPアドレスに自動的に変換してくれるアプリケーション層のプロトコルです。

## HOSTS.TXT時代

インターネットの全身であるARPNETでは、ホスト名とIPアドレスの対応表として、HOSTS.TXTというテキストファイルを使用していました。

このHOSTS.TXTはSRI-NIC (Stanford Research Institute’s Network Infomation Center) で保守・管理され、Anonymous FTPで公開されていました。

![](_images/Untitled%2077.png)

引用: [https://www.nic.ad.jp/ja/newsletter/No22/080.html](https://www.nic.ad.jp/ja/newsletter/No22/080.html)

管理のサイクルについては以下の流れです。

1. 各組織はホストを登録するときにNICに申請する
2. SRI-NICは各組織から申請があった内容をHOST.TXTに反映させる
3. 各組織のホストはSRI-NICからHOSTS.TXTをFTPで入手して利用する

しかし、この管理方法は接続ホスト数の加速度的な増加や、ファイルサイズの肥大化などによって1980年代初頭には限界に達していました。そこで、この問題を解決するための新たな仕組みが開発され、1983年にRFC882およびRFC883として発表されました。

その後、RFC882とRFC883はRFC1034とRFC1035として改版され、現在のDNSとなりました。その後も多くの機能追加や改良が行われ、現在に至っています。

## DNSの名前解決の流れ

DNSがどのような流れでドメイン名からIPアドレスを取得してきているのかについて記述していきます。まずは以下の図より全体像を把握しつつ、各機能とその働きについて理解を深めていきたいと思います。

![](_images/Untitled%2078.png)

引用: [https://jprs.jp/glossary/index.php?ID=0145](https://jprs.jp/glossary/index.php?ID=0145)


### 権威サーバー

ドメインの項で、ドメイン名はツリー構造になっていると述べました。

このツリー構造ごとにドメインを管理しているのが「権威サーバー」です。

また、権威サーバーの中で一番初めにアクセスされるサーバーを「ルートサーバー」と呼びます。

例として “example.com” というドメインを名前解決したいとします。

4. 問い合わせ側は、ルートサーバーにドメインのIPアドレスを確認しに行きます
5. ルートサーバーはTLDの情報を知っているため、問い合わせ元に対象のTLDに対応したDNSサーバーの情報 (.com) を返します
6. 問い合わせ側は、ルートサーバーに提示された情報をもとにTLD (.com) を管理する権威サーバーにもう一度IPアドレスを確認しにいきます
7. TLDの権威サーバーは2LD (example.com) の権威サーバーの情報を返却します
8. 再び問い合わせ側は2LDの権威サーバーにIPアドレスの問い合わせを行い、ここでようやく紐づけられたIPアドレス情報が返却されます。

最上位の階層となるルートサーバーは全世界に13組配置されており、以下のようにA～Mまでの種類があります。これらは13個のクラスタで、実際に稼働しているサーバーの数は1400以上にものぼるようです（参照: [https://root-servers.org/](https://root-servers.org/)）

| **ルートサーバー** | **運用組織** | **所在地** |
| --- | --- | --- |
| **A** | [**VeriSign, Inc.**](http://www.verisign.com/) | **米国バージニア州** |
| **B** | [**南カリフォルニア大学情報科学研究所(ISI)**](http://www3.isi.edu/home) | **米国カリフォルニア州** |
| **C** | [**Cogent Communications**](http://www.cogentco.com/) | **米国バージニア州** |
| **D** | [**メリーランド大学**](http://www.umd.edu/) | **米国メリーランド州** |
| **E** | [**米航空宇宙局(NASA)エイムズ研究所**](http://www.nasa.gov/centers/ames/home/) | **米国カリフォルニア州** |
| **F** | [**Internet Systems Consortium, Inc.(ISC)**](http://www.isc.org/) | **米国カリフォルニア州** |
| **G** | [**米国防総省ネットワークインフォメーションセンター**](http://www.nic.mil/) | **米国バージニア州** |
| **H** | [**米陸軍研究所**](http://www.arl.army.mil/www/default.htm) | **米国メリーランド州** |
| **I** | [**Autonomica**](http://www.autonomica.se/) | **ストックホルム** |
| **J** | [**VeriSign, Inc.**](http://www.verisign.com/) | **米国バージニア州** |
| **K** | [**Reseaux IP Europeens -Network Coordination Centre(RIPE NCC)**](http://www.ripe.net/) | **ロンドン** |
| **L** | [**Internet Corporation for Assigned Names and Numbers(ICANN)**](http://www.icann.org/) | **米国カリフォルニア州** |
| **M** | [**WIDEプロジェクト**](http://www.wide.ad.jp/) | **東京** |

1台の権威サーバーが管理する範囲を「ゾーン」と呼び、そのゾーンのDNS (名前解決のための情報) を「ゾーン情報」と呼びます。ゾーン情報を構成する1件1件の情報を「リソースレコード (DNSレコード) 」と呼びます。

### フルリゾルバー

「キャッシュDNSサーバー」や「フルサービスリゾルバー」などといった名称でもいわれています。

[example.com](http://example.com/) にクライアントがアクセスする際、毎回ドメインツリーによる名前解決を行うのは非常に手間とコストがかかります。

そこで、IPアドレスとドメイン名の紐づけをキャッシュしてくれるサーバーがあります。それがフルリゾルバーです。

どのくらいキャッシュしてくれるのかという情報はTTL (Time To Live) として持っています。

初回アクセス時にフルリゾルバーはTTLと共にドメインツリーより名前解決した情報をキャッシュします。次回以降のアクセスがあった際は、TTL内の時間であればキャッシュされた情報を返し、そうでなければまたドメインツリーによる名前解決を行います。

![](_images/Untitled%2079.png)

引用: [https://jprs.jp/glossary/index.php?ID=0158](https://jprs.jp/glossary/index.php?ID=0158)

リカーシブ (**Recursive) **は「再帰」を表す単語で、リカーシブモードについては画像引用元より以下の解説を参照します。

> リゾルバーのうち、「リカーシブモード」と呼ばれる動作を行い、内部にキャッシュを持っているものを「フルサービスリゾルバー」と呼びます。リカーシブモードとは、DNSクエリを受信した際に、キャッシュの内容から答えるか、他の権威サーバー群に問い合わせを行うモードです。
> フルサービスリゾルバーは、名前解決をする際、同じ問い合わせを何度も繰り返すという非効率を避けるために、名前解決の際に得られた情報を内部にキャッシュして再利用します。
> 
> なお、「キャッシュDNSサーバー」がフルサービスリゾルバーを示す用語として使われる場合がありますが、厳密にフルサービスリゾルバーのみを示す用語とはならないことに注意が必要です。その理由は、性能向上を図るために、権威サーバーにおいても自身のキャッシュを使用するソフトウェアが存在することによります。

もう一点、リカーシブモードについて

> フルサービスリゾルバー（キャッシュDNSサーバー）が名前解決の際に、キャッシュの内容から答えるか、必要に応じて他の権威サーバー（権威DNSサーバー）に問い合わせを行う形式（モード）です。リカーシブモードで動作し、キャッシュを持つリゾルバーをフルサービスリゾルバーと呼びます。
> DNSにおいてフルサービスリゾルバーは、スタブリゾルバー（DNSクライアント）からの名前解決要求（再帰検索要求）を受け付ける役割を担います。フルサービスリゾルバーは、名前解決をする際に、権威サーバーに同じ問い合わせを何度も繰り返すという非効率を避けるため、名前解決の際に得られた情報を内部にキャッシュして再利用します。

[https://jprs.jp/glossary/index.php?ID=0166](https://jprs.jp/glossary/index.php?ID=0166)

フルリゾルバーは所属する企業やISP (Internet Service Provider) が運用するDNSサーバーにあり、後述する端末の「スタブリゾルバー」を経由してアクセスします。

[https://jp.quora.com/DNS-kiyasshu-sa-ba-furu-sa-bisu-rizoruba-tte-doko-ni-aru-nde-suka-jibun-ie-no-ru-ta-desu-ka?ch=17&oid=38624121&share=f8213f03&srid=uxr4V4&target_type=question](https://jp.quora.com/DNS-kiyasshu-sa-ba-furu-sa-bisu-rizoruba-tte-doko-ni-aru-nde-suka-jibun-ie-no-ru-ta-desu-ka?ch=17&oid=38624121&share=f8213f03&srid=uxr4V4&target_type=question)

また、フルリゾルバーは「ドメインに対してIPアドレスが存在しない」という情報もキャッシュします。目的の情報が存在しなかった場合のキャッシュを**ネガティブキャッシュ**と呼びます。

### スタブリゾルバー

スタブ (stub) には「末端」という意味があり、主に利用者側の端末で動作し、フルリゾルバーに名前解決要求を行います。「DNSクライアント」とも呼ばれています。

![](_images/Untitled%2080.png)

引用: [https://jprs.jp/glossary/index.php?ID=0197](https://jprs.jp/glossary/index.php?ID=0197)

スタブリゾルバーは、Webサービスやアプリケーションなどのプログラムに対して、名前解決を行う手段 (API) を提供します。基本的には、一般的なPCのOS等に標準搭載されています。

スタブリゾルバーからの全体的な問い合せの流れについて、ざっくりというと、「スタブリゾルバーは再帰問い合せをフルリゾルバーに送信」し、「フルリゾルバーは再帰問い合わせの結果を返すために権威サーバーに対して反復問い合わせ (非再帰問い合わせ) を行い、最終結果 (名前解決した結果) をスタブリゾルバーに送信」します。

Windowsを使用している場合は、以下の方法でスタブリゾルバがーがキャッシュしている情報を確認することが可能です。

> 　Windows OSの場合は、クライアントOSとサーバOSの両方に、このスタブリゾルバが含まれており（「DNS Client」サービス）、手動でインストールする必要はない。スタブリゾルバがキャッシュしている内容は、コマンドプロンプトを開いて「ipconfig /displaydns」とすると確認できる。

[https://atmarkit.itmedia.co.jp/ait/articles/1706/23/news042.html](https://atmarkit.itmedia.co.jp/ait/articles/1706/23/news042.html)

### リソースレコード (DNSレコード) について

ドメイン名に関連づけられた情報のことです。

リソースレコードは基本的には以下のような構造を取ります。

- ドメイン名
- TTL (Time to Live)
- class 
- type
- RDATA

![](_images/Untitled%2081.png)

引用: [https://jprs.jp/glossary/index.php?ID=0165](https://jprs.jp/glossary/index.php?ID=0165)

typeについては様々なものが存在し、class と typeによって後に続く RDATA の値が異なります。

よく使用されるtype

- A (エー) : そのドメインのIPv4アドレスを指定
- AAAA (クワッドエー) : そのドメインのIPv6アドレスを指定
- NS : そのドメインの権威サーバーのドメイン名を指定
- MX : そのドメイン宛の電子メールの配送先と優先度を指定

上記を含んだ、代表的なtypeの一覧

| **リソースレコードのタイプ** | **目 的** |
| --- | --- |
| [SOA](https://jprs.jp/glossary/index.php?ID=0194) | ゾーンの管理情報を記述 |
| [NS](https://jprs.jp/glossary/index.php?ID=0146) | ゾーンに対する権威（オーソリティ）を持つ権威サーバー（権威DNSサーバー）のドメイン名を指定 |
| [MX](https://jprs.jp/glossary/index.php?ID=0163) | 配送における優先度を指定するプリファレンス（preference）と配送先ホストのドメイン名を指定 |
| [A](https://jprs.jp/glossary/index.php?ID=0161) | ドメイン名に対するIPv4アドレスを指定 |
| [AAAA](https://jprs.jp/glossary/index.php?ID=0162) | ドメイン名に対するIPv6アドレスを指定 |
| [PTR](https://jprs.jp/glossary/index.php?ID=0210) | IPアドレスに対するドメイン名を指定（逆引きDNSで使用） |
| [CNAME](https://jprs.jp/glossary/index.php?ID=0212) | ドメイン名に対する正式名を表すドメイン名を指定 |
| [TXT](https://jprs.jp/glossary/index.php?ID=0223) | そのドメイン名で1文字以上の文字列を保持 |
| [DS](https://jprs.jp/glossary/index.php?ID=0213) | 親ゾーンに登録され、委任先がDNSSEC署名されていることを示し、委任先の署名鍵の情報を記述 |
| [DNSKEY](https://jprs.jp/glossary/index.php?ID=0214) | DNSSECで用いる署名鍵の公開鍵に関する情報を記述 |
| [RRSIG](https://jprs.jp/glossary/index.php?ID=0224) | ドメイン名の各リソースレコードに対するDNSSEC署名を記述 |

引用: [https://jprs.jp/glossary/index.php?ID=0165](https://jprs.jp/glossary/index.php?ID=0165)

## ちょっとした疑問やら補足やら

### フルサービスリゾルバの物理的な場所

調べた限りでは、プロバイダーが持っているDNSサーバー上、ということでした。

が、ルーターにあることもあるようで、物理的な場所については様々ありそうです。

[https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14199246429](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14199246429)

ルータにあるリゾルバは、DNSフォワーダともいう？

[https://teratail.com/questions/99195](https://teratail.com/questions/99195)

この辺りの名前がどう当てはまるかについては、今後調べて固めていきたいとして、ツッコミ待ちです。

### インターネット上の名前が氾濫している問題

DNSを学ぶとき、あまりにも言葉の定義が氾濫していて理解するまでに多大な時間を要したのですが、購入した書籍「[DNSがよくわかる教科書](https://www.amazon.co.jp/dp/479739448X)」の中でその問題については懸念事項として解説がされていました。

| 構成要素 | 現在使われている別の名称 |
| --- | --- |
| スタブリゾルバー | DNSクライアントなど |
| フルリゾルバー | キャッシュDNSサーバー、参照サーバー、ネームサーバー、DNSサーバー、etc… |
| 権威サーバー | 権威DNSサーバー、ゾーンサーバー、ネームサーバー、DNSサーバー、etc… |

「ネームサーバー」「DNSサーバー」が丸かぶりしている時点でなんでやねーん！ って感じですが、そのせいで分かりにくさが加速しているなと…。

前述した書籍が網羅的に解説されているので、DNSについて理解しようとするならば周り道にならずに済むのでおすすめです。

## Public DNS

インターネットに接続していれば、原則として誰でも、どこからでも利用できるフルリゾルバーのことです。Public DNSには覚えやすいIPアドレスが割り当てられていることが多く、代表的なものとして以下のようなものがあります。

- 運営 : Cloudflare/APNIC
    - 優先IPアドレス : 1.1.1.1
    - 代替IPアドレス : 1.0.0.1
- 運営 : Google
    - 優先IPアドレス : 8.8.8.8
    - 代替IPアドレス : 8.8.4.4
- 運営 : CleanerDNS (Quad9)
    - 優先IPアドレス : 9.9.9.9
    - 代替IPアドレス : 149.112.112.112


その他、使用できるものについては以下の記事で解説がされています。

[https://www.lifewire.com/free-and-public-dns-servers-2626062](https://www.lifewire.com/free-and-public-dns-servers-2626062)

一般的には、LAN内に設置されたDNSサーバーやISP (Internet Service Provider) が用意しているDNSサーバーなど、ネットワーク的 (物理的) に近いDNSサーバーを使った方が応答速度やトラフィック、セキュリティの面で有利とされています。具体的な使用例としては、ISPが提供するDNSサーバーに障害が発生した際や、DNSサーバーの性能や通信路の帯域幅が足りていない場合、大規模な利用者数を想定したPublic DNSの方が高速な応答を得られる場合があります。

![](_images/Untitled%2082.png)

引用 : [https://xtech.nikkei.com/atcl/nxt/column/18/01882/121700014/](https://xtech.nikkei.com/atcl/nxt/column/18/01882/121700014/)

基本的に高速さなどをPubic DNSを利用する際の懸念点については、以下のようなことが挙げられています。

> **なおLAN内やISPのDNSでは、比較的経路が閉じられているため、 盗聴の危険はそれほど高くありません。 しかしパブリックDNSの場合、いわゆるインターネットを経由するため、 平文のやり取りは盗聴される危険があります。盗聴を回避するためには、 別の手段、例えばDNS over HTTPSなどで通信を暗号化する必要があります。**

[https://www.nic.ad.jp/ja/basics/terms/publicdns.html](https://www.nic.ad.jp/ja/basics/terms/publicdns.html)

どのDNSサーバーを使えばよいのだろうという点については、以下の記事でまとめられており、様々な用途によって向き不向きがあるといえると思います。ここでは参照記事の貼り付けにとどめます。

[https://dev.classmethod.jp/articles/1-1-1-1_are_you_using_it/#toc-9](https://dev.classmethod.jp/articles/1-1-1-1_are_you_using_it/#toc-9)

※ **オープンリゾルバー**とはなんなのか

Public DNSについて調べていると出てくる「オープンリゾルバー」について。「Public (パブリック)」と「Open (オープン)」で似たようなニュアンスで受け取ってしまいがちですが、それぞれで意味が異なっているため以下に引用を記載します。

> **オープンリゾルバとは、DNSの名前解決を行うサーバやネットワーク機器などのうち、 不特定のクライアントからのDNS (Domain Name System)の問い合わせについて、 最終的な答えが得られるまで繰り返し問い合わせを行う再帰的な名前解決を行い、 結果を回答するDNSサーバなどのことです。**
> **DNSの問い合わせや応答などの通信は、 主にUDP (User Datagram Protocol)を用いてデータがやりとりされます。 UDPは、通信を行う際に送信元や送信先について確認を行わないため、 通信の処理に必要な計算量や時間が少なくて済む反面、 送信元IPアドレスの偽装が比較的容易なことが特徴として挙げられます。 オープンリゾルバは、そうしたUDPが持つ性質から、 サービス拒否攻撃(DoS; denial of service)の中継点(踏み台)として利用されることがあります。**

引用 : [https://www.nic.ad.jp/ja/basics/terms/open-resolver.html](https://www.nic.ad.jp/ja/basics/terms/open-resolver.html)

> インターネット上のどのクライアントからの名前解決要求であっても実行してしまう状態のサーバーやネットワーク機器のことです。なお、ブロードバンドルーターやケーブルモデムといった機器に組み込まれているリゾルバーがオープンリゾルバーとなっているケースも存在します。
> オープンリゾルバーは、大規模なDDoS攻撃への加担など、悪意のある第三者に意図せず利用されるリスクがあります。
> 
> 一方、Google Puclic DNSやOpenDNSなど、管理されたオープンリゾルバーを提供しているサービスが存在します。これらは「パブリックリゾルバー（Public Resolvers）」と呼ばれることがあります。

引用 : [https://jprs.jp/glossary/index.php?ID=0184](https://jprs.jp/glossary/index.php?ID=0184)

引用より「誰からのアクセスであってもリクエストを受け入れてしまうため、悪用や攻撃の対象になってしまうことが問題」といえます。そのため、このオープンリゾルバーは根絶に向けて様々な企業や機関が注意喚起をおこなっています。

[https://www.iij.ad.jp/dev/tech/activities/open_resolver/](https://www.iij.ad.jp/dev/tech/activities/open_resolver/)

しかし、この定義で言えば「1.1.1.1」や「8.8.8.8」もオープンリゾルバーではないでしょうか？

どちらも「誰でも使える」という点に関しては共通していますが、具体的には以下のような違いがあるため、これらは混同しないように注意が必要です。

**オープンリゾルバー**

“管理者の意図に反して” 誰でも使えるようになってしまっているもの

**Public DNS**

“管理者が様々なセキュリティ上の対策を実施したうえ” で、意図的に誰にでも使用できるようにしているもの

# まとめ

DNSについて、基本的な仕組みをまとめてみましたが例にも漏れず長くなってしまいました。

以下の点についても記事の中に盛り込みたかったのですが、今回は断念して別の記事として切り分けるか、追記することとします。

- DNS over TLS
- DNS over HTTPS
- DNSを経由した代表的な攻撃について

おかしな点がありましたら X のDMかお問い合わせフォームよりご連絡いただけるとありがたいです。

# 参考

[https://ascii.jp/elem/000/000/447/447571/](https://ascii.jp/elem/000/000/447/447571/)

[https://zenn.dev/msy/articles/e1e5aed46a3e49](https://zenn.dev/msy/articles/e1e5aed46a3e49)

[https://speakerdeck.com/iij_pr/dnsdehttps-star-tadasidns-over-httpsdehanai](https://speakerdeck.com/iij_pr/dnsdehttps-star-tadasidns-over-httpsdehanai)

[https://qiita.com/yokozawa0701/items/b4f6b9c0fc35ec47f562](https://qiita.com/yokozawa0701/items/b4f6b9c0fc35ec47f562)

[https://www.infrastudy.com/?p=1299](https://www.infrastudy.com/?p=1299)

書籍

[https://www.amazon.co.jp/DNSがよくわかる教科書-株式会社日本レジストリサービス-JPRS-渡邉結衣、佐藤新太、藤原和典/dp/479739448X?dplnkId=0872ce24-6ab7-4e07-847b-7e9f8a8cf297&nodl=1](https://www.amazon.co.jp/DNS%E3%81%8C%E3%82%88%E3%81%8F%E3%82%8F%E3%81%8B%E3%82%8B%E6%95%99%E7%A7%91%E6%9B%B8-%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E6%97%A5%E6%9C%AC%E3%83%AC%E3%82%B8%E3%82%B9%E3%83%88%E3%83%AA%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9-JPRS-%E6%B8%A1%E9%82%89%E7%B5%90%E8%A1%A3%E3%80%81%E4%BD%90%E8%97%A4%E6%96%B0%E5%A4%AA%E3%80%81%E8%97%A4%E5%8E%9F%E5%92%8C%E5%85%B8/dp/479739448X?dplnkId=0872ce24-6ab7-4e07-847b-7e9f8a8cf297&nodl=1)

PDF

[https://www.nic.ad.jp/sc-hiroshima/program/sonoda.pdf](https://www.nic.ad.jp/sc-hiroshima/program/sonoda.pdf)

[https://www.nic.ad.jp/ja/newsletter/No49/NL49_0800.pdf](https://www.nic.ad.jp/ja/newsletter/No49/NL49_0800.pdf)