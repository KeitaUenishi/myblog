---
title: "HTTP (HyperText Transfer Protcol)についてのまとめ ② ‐ HTTPとHTTPSについて-"
id: 5gx96y8
public: true
publishedAt: 2024-03-20
editedAt: null
description: "この記事について 以下の記事の続きです。 https://www.uenishi.blog/posts/http-part-1 ① の時点では収まりきらなかったHTTPとHTTPSや、SSL/TSL証"
tags:
  - Web
---




# この記事について

以下の記事の続きです。

[https://www.uenishi.blog/posts/http-part-1](https://www.uenishi.blog/posts/http-part-1)

① の時点では収まりきらなかったHTTPとHTTPSや、SSL/TSL証明書などについてまとめていきます。

# HTTPSとHTTPについて

## HTTPS (HyperText Transfer Protocol Secure) 

Secureという名前の通りHTTPプロトコルをセキュアにしたバージョンのことで、具体的にはHTTPでやり取りする通信が暗号化された状態を表します。

ここで勘違いしがちなのですが、「HTTPS」というプロトコルがあるわけではなく、SSL (Secure Sockets Layer) / TLS (Transport Layer Security) と呼ばれるプロトコルによって暗号化した経路の上でHTTP通信を行うことをいいます。そのため、ネット上では時折「HTTP over SSL/TLS」といった記述も見られます。

SSL/TLSを用いて通信を暗号化する例は他のプロトコルにもあり、SMTPを暗号化したSMTPSやPOP3を暗号化したPOP3Sなどもあります。

HTTPとHTTPSのわかりやすい部分の特徴については、各項目で具体的に以下のような点で違いが現れます (http → https) 。

URL (スキーム) 

- http:// → https://

ポート番号

- 80 → 443

必要なもの

- Webブラウザ → Webブラウザ & SSLサーバー証明書

現代 (2024年) におけるほとんどのWebサイトやWebアプリケーションはHTTPSを用いており、HTTPの場合はブラウザが警告を出すようになっています（Chromeは2018年7月リリースのv68より対応）。

参考

[https://transparencyreport.google.com/https/overview?hl=ja](https://transparencyreport.google.com/https/overview?hl=ja)

![](_images/Untitled%208.png)

## HTTPSのメリット

### 1. 盗聴や通信内容の改ざん対策

Webサーバーとクライアント (Webブラウザ) 間の通信が暗号化されるので、第三者に通信内容を盗聴されたり、内容を改ざんされたりすることがなくなります。

HTTPSによる通信の暗号化は「エンド・ツー・エンド」で行われます。これはWebサーバーとクライアントのみでのみ暗号化 / 復号化が行われるため、途中にあるプロキシサーバーやキャッシュサーバー、ルーターや無線LANの電波などを傍受したとしても、内容は暗号化されているため解読することはできません。

### 2. なりすまし対策

HTTPSではPKI (公開鍵暗号基盤) を使ってHTTPSで利用する証明書などを管理しています。これによってWebサーバーが正規のドメイン所有者によって運営されていることを保証しています。

不正なWebサイトにユーザーを誘導しようとしたとしても、正規のWebサーバーの証明書を入手できなければ、正規のドメインでHTTPSに対応したWebサイトを作ることはできません。

### 3. 通信の高速化

HTTPをより高速にしたプロトコルとして、HTTP/2があります。

HTTP/2は従来の通信をより効率化するもので、パフォーマンスの改善に大きな影響を与えますが、HTTPSの対応を前提としています (後で少し補足)。

HTTPSに対応することで、HTTP/2での通信が可能となり、結果的に高速な通信が行えるようになります。

### 4. SEO対策

Googleは2014年8月時点で、httpsに対応したWebサイトの検索結果順位を、そうでないサイトより少し上げると公表しています。

[https://developers.google.com/search/blog/2014/08/https-as-ranking-signal?hl=ja](https://developers.google.com/search/blog/2014/08/https-as-ranking-signal?hl=ja)

検索順位に与える影響の割合はわかりませんが、この宣言による影響でよりHTTPSが迅速に普及していったと思われます。

## SSLとTLS

SSLはSecure Sockets Layer、TLSはTransport Layer Securityの略称で、どちらもインターネット上でデータを移動する際、データを暗号化して接続を認証するトランスポート層に位置するプロトコルです。信頼性確保のため、TCPを同時に使用します。そのため、TCPを用いるアプリケーションのプロトコルであればSSL/TLSを使用することができます。

※ TCP/IP の階層についてはいろいろな見方で書かれている記事が多かったため、下記を参照

[https://xtech.nikkei.com/it/atcl/column/16/072100153/072100007/](https://xtech.nikkei.com/it/atcl/column/16/072100153/072100007/)

これらの単語は基本的にセットで使われることが多いですが、SSLの最新バージョンであるSSL 3.0は2015年に廃止されており現在実際に使われているのは ”TLS” です。

TLSはSSLの「新しいバージョン」のことを指していて、1996年にリリースされたSSL 3.0のアップグレードとして1999年にリリースされました。その後、2014年10月にSSL 3.0に脆弱性が発見され、根本的な対処法としては「SSL 3.0」を無効化するしか方法がありませんでした。その後、2015年6月にはIETFによってRFC7568にて使用禁止とされました。

> SSLv3 MUST NOT be used.  Negotiation of SSLv3 from any version of TLS
MUST NOT be permitted.

> SSLv3を使用してはなりません。 TLSの任意のバージョンからのSSLv3のネゴシエーションは許可されてはなりません。

ところでなぜSSLという言葉がいまだに残っているかというと、これまで通信の暗号化を行うプロトコルとしてSSLがずっと使われてきていたため、その名残で今も残っているとされています。

そのため、SSLと呼ばれているものは = TLSを指していることも多く、場合によっては両方の意味を含めて「SSL/TLS」と表現されています。厳密に考えると別物のためややこしいですが、現代では明確にSSLを説明するものでなければほとんどTLSを指していると考えてよいかと思います。

[https://knowledge.sakura.ad.jp/21468/](https://knowledge.sakura.ad.jp/21468/)

SSL/TLSの仕様について詳細に深掘ることはこの記事ではしませんが、HTTPSで通信を行う中でどのようなことを行っているのかは後述します。

## サーバー証明書

### 認証局 (CA, Certificate Authorities)

Webサイトやその他の独立した存在などに「デジタル証明書」を発行する信頼できる組織のことです。

認証局はその信頼性をより強めるために「認証局が発行する電子証明書」に対して、第三者として「他の認証局が電子署名」を行うことで正当性を担保する、という仕組みを取ります。

しかし、この仕組みでは以下のような問題があります。

- 他の認証局が署名して発行した「認証局自身の電子証明書」を入手しなければならない
- その署名が信用できるか確かめるために、さらに「別の認証局の発行した証明書」を入手する必要がある
- 無限ループのように証明書をたどっていかなければいけない

この問題を解決するため、認証局は「ルート認証局」と「中間認証局」といった階層構造を取ります。

**ルート認証局 (root CA)**

上位の認証局による認証を受けず、自分の正当性を自ら保証する機関。

他の認証局に対してデジタル証明書を発行する役割を持ちこれを「ルート証明書」と呼びます。

ルート証明書の信頼性は、以下のように様々な観点から担保されるようになっています。

- 外部機関による厳しい審査
- 認証業務運用規定 (CFP, Cyber-Physical System**) **の公開
- 運用実績や知名度など、デジタル証明書以外の方法

以下、引用となります

> そこで代表的なウェブブラウザやメールクライアントには、GMOグローバルサインなどのようにWebTrust等の厳しい監査基準を満たした認証局(CA)のルート証明書があらかじめ搭載されており、ソフトウェアの利用を通して意識することなく電子証明書の信頼性を確認できるようにしています。
> つまりソフトウェアはWebTrust for CAの監査基準を満たした認証局を信頼し、ユーザはソフトウェアを信頼する。この信頼のつながりによってユーザは個別に認証局を調べることなく、ブラウザの利用を通して意識することなく証明書の信頼性を確認できるのです。

[https://college.globalsign.com/ssl-pki-info/ca_trust/](https://college.globalsign.com/ssl-pki-info/ca_trust/)

> その信頼がどこからくるのか、という点に関しては「どうして国が信頼できるのか」「どうして銀行が信頼できるのか」という問いに同じく、社会全体で信頼が認知され、またそれが継続的に維持されるような構造になっています。

[https://qiita.com/t_nakayama0714/items/83ac0b12ced9e7083927#信頼できる第三者](https://qiita.com/t_nakayama0714/items/83ac0b12ced9e7083927#信頼できる第三者)

**中間認証局 (Intermediate CA)**

上位の認証局の発行した証明書により、自らの正当性を証明する機関のこと。ルート認証局以外の認証局のことをいいます。

ルート認証局と違い、自らの証明の真正性に関しては別の認証局の証明書を用いる必要があります。

また、前述のように、証明書の信頼性を担保するためにずっと上位の証明をたどっていく、ということにならないよう、Webブラウザなどはルート認証局の自己署名証明書を内蔵しているかを確認します（Chromeであれば、証明書ビューアから以下のように階層を確認できます）

![](_images/Untitled%209.png)

認証レベルによって価格がつけられており、レベルが高くなるにつれて価格も高くなっていきます。

### DV認証 (Domain Validation)

「ドメイン認証」のことで、主に個人のブログやホームページなどに用いられ、比較的安価に導入できます。

### OV認証 (Organization Validation)

「企業認証」のことで、企業のコーポレートサイトなどに用いられます。

証明書はドメインに加えて、所在地や会社名を確認することができます。

### EV認証 (Extended Validation Certificate)

DV認証、OV認証に加え、電話での実在確認や会社の状況確認など、様々な審査が行われて発行されます。

Chromeの場合、2019年9月以前はアドレスバーに組織情報が表示されるようになり、より信頼性がアピールされていたようですが、v77のアップデート以降は表示されなくなりました。

何でなくなったの？ ということについては以下の記事で考察されていた内容が、理解にあたって分かりやすかったです。

> つまり「このページは安全だ」と主張することができるグリーンのバッジを逆手にとってユーザーを誤解させ、必要な警戒を解かせてしまうため、肯定的な情報を提供する対策というのは逆効果になりうるということだな。

[https://thom.hateblo.jp/entry/2023/04/02/130832](https://thom.hateblo.jp/entry/2023/04/02/130832)

## HTTPSでの実際の通信方法

以下のようなフローでクライアントとWebサーバーの通信が行われます。

以下、画像2点は引用させていただいています。

![](_images/Untitled%2010.png)

参照: [https://shukapin.com/infographicIT/https](https://shukapin.com/infographicIT/https)

![](_images/Untitled%2011.png)

参照: [https://milestone-of-se.nesuke.com/nw-basic/tls/https-structure/](https://milestone-of-se.nesuke.com/nw-basic/tls/https-structure/)

文面でまとめると、以下のようになります

1. TCP 3way Handsshakeを行いTCPコネクションを確立します（これはHTTPでも同じです）
2. TSLハンドシェイクが行われます
    1. **「Client Hello」メッセージ：**クライアントがサーバーに「Hello」というメッセージを送信することによってハンドシェイクを開始します。
    2. **「Server Hello」メッセージ：**サーバーが Client Hello を受けて、SSL/TLS 通信に使用する暗号スイートを決定したり、通信の暗号化に使用する鍵の情報をクライアントに通知します
    3. **「Server Certificate」：**サーバーはクライアントに対して、身分情報としてサーバー証明書を送信します
        1. クライアント側では、サーバーから送信された証明書に対してルート認証局の自己署名証明書が含まれているかを確認し、サーバー証明書に含まれる公開鍵の情報を取得します
    4. **「Server Key Exchange」：**サーバーが共通鍵の利用に必要なパラメータに関する情報をクライアントに送ります
    5. **「Certificate Reqest」：**サーバーがクライアントを認証する必要がある場合に、クライアントに対して認証用の証明書を送るように要求します。認証が不要な場合は省略されます
    6. **「Server Hello Done」：**Server Helloから始まる一連のメッセージが終了したことをクライアントに通知します
    7. **「Client Certificate」：**サーバーからCertificate Reqestを受けた場合クライアントの認証用の証明書を送信します。Certificate Reqestが送信されていない場合は省略されます
    8. **「Client Key Exhange」：**クライアントとサーバだけが知り得る共通鍵を生成するために、プリマスタシークレットと呼ばれる乱数情報を生成します。クライアントは、生成したプリマスタシークレットをサーバの公開鍵を使用して暗号化した上で、サーバに送信します
    9. **「Client Verify」：**クライアント証明書に対する署名データとして送信します。Client Requestが送信されていない場合は省略されます
    10. **「 Change Cipher Spec (client → server)」：**クライアントが暗号化通信に必要な準備が完了したことを示すメッセージです。Server Hello時に送信された乱数とプリマスターシークレットを使用して「マスターシークレット」を作成します。このマスターシークレットから共通鍵を生成し、以降はこの共通鍵を用いて暗号化通信を行うことを通知します。
    11. 「finished **(client → server)**」：クライアントがサーバー認証に成功して、共通鍵を共有できたことをサーバーに通知します
    12. **「 Change Cipher Spec (server → client)」：**clientと同様に、マスターシークレットから共通鍵を生成し、以降はこの共通鍵を用いて暗号化通信を行うことを通知します
    13. 「finished **(client → server)**」：サーバーがクライアント認証に成功して、共通鍵を共有できたことをクライアントに通知します
3. 共通鍵暗号方式を用いて暗号化したHTTPリクエストとレスポンスを送受信します
4. データの送受信が終了後、通信終了を伝えるメッセージをお互いに受け取り通信が切断されます

参考資料

[https://pkiwithadcs.com/ssltls_handhshake/](https://pkiwithadcs.com/ssltls_handhshake/)

[https://www.cloudflare.com/ja-jp/learning/ssl/what-happens-in-a-tls-handshake/](https://www.cloudflare.com/ja-jp/learning/ssl/what-happens-in-a-tls-handshake/)

[https://www.infraexpert.com/study/security28.html](https://www.infraexpert.com/study/security28.html)

## ちょっとした追記

### EVの証明書ってどれだけ信頼性高いの？

サーバー証明書は「ドメイン名の示すサーバーが本物のサーバー」であることを示す身分証明書のようなものであって、サイト自体の信頼性とは関係ない

→ 身分証明書そのものに信頼性などなく、その本人の信頼性によって判断される

[https://qiita.com/angel_p_57/items/446130934b425d90f89d](https://qiita.com/angel_p_57/items/446130934b425d90f89d)

> なぜ気にする必要がないかというと、**サイトを識別するのがドメイン名**であることから、**そのドメイン名のサイトの運営者かどうかが最重要ポイント**であって、組織情報はあくまで付加的なものでしかないからです。

探れば探るほど、「信頼」という概念の難しさを感じますが、記事から以下のポイントを意識して読み解くと理解しやすくなったと感じます。

- SSL/TLSは接続先が意図したドメイン名のサイトかどうかを保証するもの
    - サイトの信頼性（運営者が悪いやつではないか、有害なコンテンツではないか）を保証するものではない
- 証明書を発行する認証局は、そのサイトや運営者の信頼調査を生業とする組織ではない
    - フィッシングサイト / マルウェアチェックを独自に行う業者もあるが、「ユーザー」の目線からアクセスのたびにその認証局の実施しているサービスを調べて信頼性を判断するか？ → 現実的にはやらない
    - ユーザーが知りたいのは「会社が○○である」ではなく、「自分が知っているあの会社と同じ組織か」

そのほか関連しそうな有識者の回答があったので引用しておきます

> EV SSLの方が安全ですが、「どれくらいセキュアか」という質問に答えるのは難しいです。定量的に計測できるものではありません。なぜなら、EV SSLが効力を発揮するのは、利用者しだいだからです。

[https://qr.ae/psncep](https://qr.ae/psncep)

> 昔、SSLに関する調査をしたことがあるのですが、証明書の価格差が安全性に大きく寄与するわけではないようでした。
> 高いSSLを入れるメリットとしては、お金をオンラインでやり取りする銀行をはじめとした金融機関が、「うちは一番いいセキュリティ対策をしていますよ」というアピールになることだと思います。（認証局の会社が、大きな違いはないと言っていました）

[https://qr.ae/psnccQ](https://qr.ae/psnccQ)

### 認証局立ててぼろ儲けする？

そもそも「認証局」ってどんな存在で、どうやって創業して運営しているんや？ と書いていて気になったのでいろいろと調べてみた。

本当にそういったエピソードを語っているような記事だったりが全く見つからないなか、以下のような記事がqiitaに上げられていました。

> 要は認証局とか証明書っていうのは、信頼の連鎖なわけよ。
俺が信頼すると決めた奴の言うことは俺も100%信頼する、という、さ。
> 公的な認証局になるってことは他人のセキュリティを支配可能になるということとほぼ同じ。
> だから国とか特別な公的な団体とか色んな人間に日々監査され信頼された大企業とか、
> 特別に「信頼出来る組織」が運用してる認証局しか基本使えないし、使わないの。
> OSやブラウザにデフォルトでインストールされている認証局ってのはそういう存在なの。
> 
> これだけ説明すれば個人が公的な認証局になるなんてことはほぼ不可能だと分かるだろ？

[https://qiita.com/kawaz/items/f90810b9ea823b6556a8](https://qiita.com/kawaz/items/f90810b9ea823b6556a8)

ちなみに、以下では立ち上げから運営まで行うにあたってのステップが記されていて、非常に興味深い内容でした。

[https://atmarkit.itmedia.co.jp/fnetwork/tokusyuu/03pki/pki01.html](https://atmarkit.itmedia.co.jp/fnetwork/tokusyuu/03pki/pki01.html)

[https://contents.nii.ac.jp/sites/default/files/2020-02/txt4-1_0.pdf](https://contents.nii.ac.jp/sites/default/files/2020-02/txt4-1_0.pdf)

あんまり情報出てこない分、証明書ビジネスがどんな動きをしているか気になってくる……（HTTPとは別の話題なのでここまでにする）

[https://webtan.impress.co.jp/e/2007/09/10/1839](https://webtan.impress.co.jp/e/2007/09/10/1839)

### Let’s Encrypt

ISRG (Internet Security Research Group) が運営している証明書認証局のことで、2016年4月に正式に開始されました。

ACME (Automatic Certificate Management Environment) という証明書の管理を自動化するプロトコルを利用し、証明書の発行を自動で行います。

※ ACMEはRFC8555で定義されている仕様です

[https://jprs.jp/pubcert/about/ACME/](https://jprs.jp/pubcert/about/ACME/)

[https://www.rfc-editor.org/info/rfc8555](https://www.rfc-editor.org/info/rfc8555)

ドメインを取得し、linuxサーバー上などでコマンドを入力することで、90日間有効なDV証明書が発行されます。無料ではありつつも、暗号強度などは有料で発行されている証明書と違いはなく、現在では多くの証明書が発行されています。

### オレオレ証明書

証明書は本来であれば、ルート認証局から連鎖されてきた中間認証局が署名を行うことで、その信頼性を担保します。

しかし、証明書を発行する母体が「その証明書に署名を行う」といった形でも形上は「証明書」として機能します。

これを一般的に「オレオレ証明書」と呼んでいます。

（オレが発行してオレが保有している証明書が確かなことをオレが証明するで！ ということで、オレオレ詐欺のニュアンスで使われ始めたらしい）

オレオレ証明書を所持するサーバーにアクセスしようとすると、公に信頼されている認証局からの証明が行われていないため、ブラウザでは「この接続は安全ではありません」といった警告が表示されることがあります。

誰でも見ることができないような環境（開発サーバー環境など）では使用されることも多いようですが、最近は手軽さもありLet’s Encryptを使用することが多いようです。

オレオレ証明書の区分について

[https://takagi-hiromitsu.jp/diary/20071117.html#p02](https://takagi-hiromitsu.jp/diary/20071117.html#p02)

非常にわかりやすかったbooks

[https://zenn.dev/tanakanata7190/books/0133b145478eba](https://zenn.dev/tanakanata7190/books/0133b145478eba)

### HTTP/2はHTTPSでしか動かない？ ホンマ？

記事内で、「HTTP/2」は「HTTPS」を前提として動いている、と記載しました。

HTTP/2について詳しく調べていくうちに、あれ？ となった箇所がありました。

> HTTP/2 uses the "`http`" and "`https`" URI schemes defined in [Section 4.2](https://www.rfc-editor.org/rfc/rfc9110#section-4.2) of [[HTTP](https://www.rfc-editor.org/rfc/rfc9113.html#RFC9110)], with the same default port numbers as HTTP/1.1 [[HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9113.html#RFC9112)]. These URIs do not include any indication about what HTTP versions an upstream server (the immediate peer to which the client wishes to establish a connection) supports.

> HTTP/2 は、[HTTP] のセクション 4.2 で定義された "http" と "https" の URI スキームを使用し、デフォルトのポート番号は HTTP/1.1 [HTTP/1.1] と同じです。これらの URI は、上流のサーバ(クライアントが接続を確立したい相手)がどの HTTP バージョンをサポートしているかについての表示を含みません。

[https://www.rfc-editor.org/rfc/rfc9113.html#section-3](https://www.rfc-editor.org/rfc/rfc9113.html#section-3)

RFCでは明確に”http”か”https”を使用すると記載がされています。

更に続く以下ではHTTP/2がサポートされる手段はhttpとhttpsで異なります、といった記載も見られます。

> The means by which support for HTTP/2 is determined is different for "`http`" and "`https`" URIs. Discovery for "`https`" URIs is described in [Section 3.2](https://www.rfc-editor.org/rfc/rfc9113.html#discover-https). HTTP/2 support for "`http`" URIs can only be discovered by out-of-band means and requires prior knowledge of the support as described in [Section 3.3](https://www.rfc-editor.org/rfc/rfc9113.html#known-http).[¶](https://www.rfc-editor.org/rfc/rfc9113.html#section-3-3)

> HTTP/2 のサポートを決定する手段は、"http "と "https "の URI で異なる。https URI の検出については、セクション 3.2 で説明する。http" URI に対する HTTP/2 サポートは、帯域外の手段によってのみ発見することができ、セクション 3.3 に記述されているように、サポー トに関する事前知識を必要とする。

また、以下のYahooテックブログでもHTTP/2は80万ポートと443ポートを使用して通信を行うと記載があります。

> HTTP/2 では HTTP/1.1 と同様、80 番と 443 番ポートを使用して通信を行います。これにより新たに HTTP/2 用にポートを開放するなどといった作業が不要になっています。

[https://techblog.yahoo.co.jp/infrastructure/http2/ats_http2_pn/](https://techblog.yahoo.co.jp/infrastructure/http2/ats_http2_pn/)

これらを調べた限り、以下のことが分かりました。

- HTTP/2にはTLSを使用するHTTPと、使わないHTTPがある
    - HTTPS (HTTP/2 over TLS)
        - TLSを用いた暗号化通信を行う
    - HTTP (HTTP/2 over cleartext TCP)
        - TLSを用いないで平文 (cleartext) で通信を行う


HTTP/2 over TLSを “h2”

HTTP/2 over cleartext TCPを “h2c”

という識別子で分けられているようです。

これらはどこで振り分けられるかというと、HTTP/2通信を開始するためのプロトコルネゴシエーションによって分けられます。

※ 詳細は以下の記事を参照

[https://qiita.com/nozmiz/items/3bf03533895251c93af2#httpsh2-と-httph2c](https://qiita.com/nozmiz/items/3bf03533895251c93af2#httpsh2-と-httph2c)

以下の同じような疑問にも、ブラウザはh2のみをサポートしているといった回答が付けられており、英語版のwikiにもしっかりと記載されていました。

> The reason is that all browsers decided to support HTTP/2 only in encrypted mode (`h2`) for various reasons.
> As a consequence most tools (libraries, webservers, cli tools, etc.) also focused on supporting HTTP/2 over TLS with ALPN, and most often do not support the unencrypted variant (`h2c`) which either requires a HTTP upgrade or to have prior knowledge about HTTP/2.
> 
> In your case curl [seems to support HTTP/2 upgrade requests](https://curl.haxx.se/docs/http2.html), but the google webservers do not.

> その理由は、すべてのブラウザがさまざまな理由から、HTTP/2を暗号化モード（h2）のみでサポートすることに決めたからだ。
> その結果、ほとんどのツール(ライブラリ、ウェブサーバ、cliツールなど)はHTTP/2 over TLS with ALPNのサポートに重点を置き、HTTPのアップグレードが必要かHTTP/2についての予備知識が必要な非暗号化バリアント(h2c)をサポートしないことがほとんどでした。
> 
> あなたの場合、curlはHTTP/2のアップグレードリクエストをサポートしているようですが、グーグルのウェブサーバーはサポートしていません。

[https://stackoverflow.com/questions/45011378/http-2-behaviors-with-http-and-https](https://stackoverflow.com/questions/45011378/http-2-behaviors-with-http-and-https)

> HTTP/2 is defined both for HTTP URIs (i.e. without TLS [encryption](https://en.wikipedia.org/wiki/Encryption), a configuration which is abbreviated in **h2c**) and for HTTPS URIs (over TLS using [ALPN](https://en.wikipedia.org/wiki/ALPN) extension[[48]](https://en.wikipedia.org/wiki/HTTP/2#cite_note-rfc7301-48) where [TLS 1.2](https://en.wikipedia.org/wiki/TLS_1.2) or newer is required, a configuration which is abbreviated in **h2**).
> Although the standard itself does not require usage of encryption,[[49]](https://en.wikipedia.org/wiki/HTTP/2#cite_note-HTTP/2_Frequently_Asked_Questions-49) all major client implementations (Firefox,[[50]](https://en.wikipedia.org/wiki/HTTP/2#cite_note-mozillawiki-50) Chrome, Safari, Opera, IE, Edge) have stated that they will only support HTTP/2 over TLS, which makes encryption [de facto](https://en.wikipedia.org/wiki/De_facto) mandatory.[[51]](https://en.wikipedia.org/wiki/HTTP/2#cite_note-51)

> HTTP/2は、HTTP URI(すなわちTLS暗号化なし、h2cで省略される構成)とHTTPS URI(ALPN拡張[48]を使用するTLS上で、TLS 1.2以降が要求される、h2で省略される構成)の両方に対して定義される。
> 標準自体は暗号化の使用を要求していないが[49]、すべての主要なクライアント実装（Firefox、[50] Chrome、Safari、Opera、IE、Edge）は、TLS上でのHTTP/2のみをサポートすると表明しており、暗号化が事実上必須となっている[51]。

[https://en.wikipedia.org/wiki/HTTP/2#Encryption](https://en.wikipedia.org/wiki/HTTP/2#Encryption)

つまり、この「HTTP/2はHTTPSを前提としてサポートしている」という文言についての正確なところは、RFC9113にてHTTP/2の仕様としてはサポートはしているが、主要なクライアント実装（ブラウザ）はh2のみしかサポートしていないため、実質的にWebサイトはHTTPS化していないとHTTP/2は使えない、というところになりそうです。なるほどね……。