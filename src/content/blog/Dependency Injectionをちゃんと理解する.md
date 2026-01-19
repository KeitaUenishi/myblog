---
title: "Dependency Injectionをちゃんと理解する"
id: 5ghyf88
public: true
publishedAt: 2024-08-07
editedAt: null
description: "DIに関する個人的なメモ。 DI (Dependency Injection) とは Dependency (依存性) Injection (注入) > 依存性の注入（いぞんせいのちゅうにゅう、英:"
tags:
  - 設計
---



DIに関する個人的なメモ。

# DI (Dependency Injection) とは

Dependency (依存性)

Injection (注入)

> ***依存性の注入****（いぞんせいのちゅうにゅう、*[*英*](https://ja.wikipedia.org/wiki/%E8%8B%B1%E8%AA%9E)*: Dependency injection）とは、ある*[*オブジェクト*](https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88_(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0))*や関数が、依存する他のオブジェクトや関数を受け取る*[*デザインパターン*](https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2))*である。英語の頭文字から****DI****と略される。DIは*[*制御の反転*](https://ja.wikipedia.org/wiki/%E5%88%B6%E5%BE%A1%E3%81%AE%E5%8F%8D%E8%BB%A2)*の一種で、オブジェクトの作成と利用について*[*関心の分離*](https://ja.wikipedia.org/wiki/%E9%96%A2%E5%BF%83%E3%81%AE%E5%88%86%E9%9B%A2)*を行い、疎結合な*[*プログラム*](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF))*を実現することを目的としている。

dependency*を「依存性」と訳すのは本来の[意味](https://ja.wikipedia.org/wiki/%E6%84%8F%E5%91%B3)[[1]](https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5#cite_note-1) から外れているため「**依存オブジェクト注入**」の用語を採用する文献も複数存在する[[2]](https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5#cite_note-2)[[3]](https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5#cite_note-3)。

出典 : [依存性の注入](https://ja.wikipedia.org/wiki/依存性の注入)

ざっくりとした意味合いとしては、「オブジェクトが依存するオブジェクトを、インターフェースとして受け取る実装パターン」のことです。

これにより、クラス間の結合度が軽減され、コードの柔軟性と再利用性が向上します。

DIに合わせてよく聞く「DIコンテナ」はDI実現を補助するためのフレームワークであり、実際はDIコンテナを用いなくてもDIを実現することは可能です。

例えば、以下のようなソースコードの場合  (Java)

```java
public class FooWriter {
  public void writeFoo() {
    System.out.println("foo");
  }
}

public class BarService {
  private fooWriter = new FooWriter();
  
  public void excecute() {
    fooWriter.writeFoo("Bar");
  }
}
```

上記のような実装方法は、設計上あまりよろしくありません。

- BarServiceは内部でFooWriterを直接 new して利用している
    - 「BarServiceがFooWriterに依存している」状態といえる

図に表すと、以下のようになります

<!-- Column 1 -->
![](_images/image%2047.png)

<!-- Column 2 -->


このようにクラス同士が密結合したコードは柔軟性に劣り、変更が難しくなるためです。

例えば、もし書き込み部分をFooWriter以外で書き換えたい場合、直接BarServiceの実装を書き換える必要があります。

- この実装の場合、BarServiceの責務は「Barと書き込む」ことだけであり、それ以外の理由でBarServiceが変更されるのは「単一責任の原則」に背くことになる
- またFooWriter自体が依存関係を含んでいる場合、これをBarService内で構築する必要がある
    - テスタビリティの低さも問題。BarServiceにモックのfooWriterを挟むことができないため、単体テストが困難になる


これらの問題を解決するために何を行うかというと

**インターフェースを定義してその具象オブジェクトを渡すことで依存関係を逆転させる、**ということを行います

```java
public interface Writer {
  void writeFoo();
}

public class FooWriter implements Writer {
  public void writeFoo() {
    System.out.println("foo");
  }
}

public class BarService {
  private final fooWriter;

  public BarService(Writer fooWriter) {
    this.fooWriter = fooWriter;
  }
  
  public void excecute() {
    fooWriter.writeFoo();
  }
}
```

依存するオブジェクトを外部から注入（オブジェクトを使用する側からオブジェクトを渡すようにする）ことで、BarServiceを書き換えることなく、FooWriterの実装を差し替えることが可能になります。

こちらも図に表すと、以下のようになります。

BarServiceはinterfaceであるWriterに依存しており、FooWriterには依存していません。

FooWriterはWriterを実装することで、BarServiceがFooWriterに依存する、という形を取ることができます。

![](_images/image%2048.png)

このように、DIを用いることでオブジェクト間の結合度を下げ、より独立した、柔軟性の高い設計が可能になります。

# 制御の反転 (Inversion of Control : IoC) とDIの普及

1990年代中盤に、 Inversion of Control（IoC、制御の反転）という概念が登場しました。

> コンピュータ[プログラミング](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0)の用語で**制御の反転**（Inversion of Control、**IoC**）とは、なんらかの種類のプログラムにおいて、[プロシージャ](https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B7%E3%83%BC%E3%82%B8%E3%83%A3)を「呼び出す側」と「呼び出される側」が、従来のプログラムとは逆になるようにする、ということである。たとえば従来の、[シェル](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%82%A7%E3%83%AB)のコマンドで実行される古典的なアプリケーションではメインループが最上位で動いており、そこからライブラリなどのAPIを呼ぶのに対し、ウェブブラウザ中で実行されるJavaScriptアプリケーションでは、各種のハンドラがブラウザから呼ばれてアプリケーションが動く、というのも大きく見ればそのような「反転」の一種と言える。これが使われる一例としては、プログラムの[モジュール化](https://ja.wikipedia.org/wiki/%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB)を促進して、その[拡張性](https://ja.wikipedia.org/wiki/%E6%8B%A1%E5%BC%B5%E6%80%A7)を高めるために用いられている [[1]](https://ja.wikipedia.org/wiki/%E5%88%B6%E5%BE%A1%E3%81%AE%E5%8F%8D%E8%BB%A2#cite_note-1)。

出典 : [https://ja.wikipedia.org/wiki/制御の反転#:~:text=コンピュータプログラミングの用語で,する、ということである。](https://ja.wikipedia.org/wiki/%E5%88%B6%E5%BE%A1%E3%81%AE%E5%8F%8D%E8%BB%A2#:~:text=%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E3%81%AE%E7%94%A8%E8%AA%9E%E3%81%A7,%E3%81%99%E3%82%8B%E3%80%81%E3%81%A8%E3%81%84%E3%81%86%E3%81%93%E3%81%A8%E3%81%A7%E3%81%82%E3%82%8B%E3%80%82)

> [ソフトウェアフレームワーク](https://ja.wikipedia.org/wiki/%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF)、[コールバック](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF_(%E6%83%85%E5%A0%B1%E5%B7%A5%E5%AD%A6))、[スケジューラ](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%82%B1%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%B0)、[イベントループ](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%83%AB%E3%83%BC%E3%83%97)、[依存性の注入](https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5)は、制御の反転の原則に従った[デザインパターン](https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2))の例である。

制御の反転は、以下のような設計目的のために使われます

- あるタスクの実行を実装から分離するため
- あるモジュールを、目的とするタスクだけに集中させるため
- モジュールを作る際に、他のシステムがなにをどうするかについて仮定しながらコーディングすることから解放し、契約に依拠してコーディングするため
    - 「契約プログラミング」または「契約による設計」と呼ばれるソフトウェア設計の方法論
- モジュールを置き換える際の副作用を予防するため

冗談として「ハリウッドの原則」と呼ばれることがあるようです。つまりは「君の方から電話してこないで。**君が必要な時はこっちから電話するから**」ということのよう。

「制御の反転」は「DI (Dependency Injection) 」と密接に関連している。制御の反転を実現する有効な手段のひとつとして、2000年代初頭頃からDIが注目され始めました。

そして2004年に、マーティン・ファウラーが「Inversion of Control Containers and the Dependency Injection pattern」という文献を発表。ここから一気にDIの概念が普及していきました。

[https://martinfowler.com/articles/injection.html](https://martinfowler.com/articles/injection.html)


初期のDIコンテナ（後述）の代表的なものとして、以下のようなフレームワークが台頭し、一般的なものとなっていきます。

1. Spring Framework (Java)
2003年にロッド・ジョンソンが開発。DIをコア機能として提供し、Javaコミュニティで広く普及。その後、多機能なWebフレームワークへと進化していく。
2. Google Guice (Java)
2006年にリリース。アノテーションベースのDIを提供し、シンプルさと協力な機能で人気を博した。現在ではあまり使われている様子はなさそう。
3. Unity (C# / .NET)
2008年にリリース。マイクロソフトが提供するDIコンテナで、.NETアプリケーションに広く利用されている。

また、2010年以降に出てきたDI採用フレームワークとしては、以下のようなものがある模様です

4. 2010年〜 Angular (JavaScript / TypeScript)
5. 2017年〜 NestJS (JavaScript / TypeScript)
6. 2011年〜 Laravel (PHP)
7. 2016年〜 ASP.NET Core (C# / .NET)


## 「依存性の注入」という訳について

「依存性の注入」という言葉だと依存する関係を注入するものと捉えがちだけど、実際は「使用する側が依存物（オブジェクト）を注入」できるようにすること、という意味合いに思う。

ここは日本語化した時の訳がミスっているのでは？ という説が強く、自分もそう感じるところ（素直に字面を読み取ると本当にわからん）。

> 本来は「依存物の注入」だとか「依存オブジェクトの注入」などの方が概念を理解しやすかったはずです。
> しかし「依存性の注入」という意味不明な造語に訳してしまったため、初学者が概念を正しく理解する妨げになっています。
> 
> 例えば、日本語でDIを検索すると「DIとは『依存している』という関係を注入するパターンです」などという意味不明な解説がよく見られます（**依存を弱めるのがDIの目的なのに逆に注入してどうするのか**）。
> 
> それに対し、英語版Wikipediaでは**「DIとはオブジェクトが、依存している他のオブジェクトを受け取るデザインパターンです」**と非常に単純明快に説明されています。
> 
> 関係や性質ではなくオブジェクトという「もの」を注入しているのです。

[https://xn--jp-7d4a.quora.com/依存性の注入-は誤訳ですか-DIは何らかの性質ではなく/answers/381800689?ch=17&oid=381800689&share=d476c11b&srid=uxr4V4&target_type=answer](https://xn--jp-7d4a.quora.com/依存性の注入-は誤訳ですか-DIは何らかの性質ではなく/answers/381800689?ch=17&oid=381800689&share=d476c11b&srid=uxr4V4&target_type=answer)

> ここでは、明確に「dependency」とは「オブジェクト」であると定義されています。
> 「オブジェクトを注入する」と言うと日本語としても意味がはっきりしていますね。
> 
> Wikipediaによると「dependency」は使われるオブジェクト（サービスと呼ぶ）であり、「injection」とはそのオブジェクト（＝サービス）を、それを使うオブジェクト（クライアントと呼ぶ）に渡すことです。
> 
> ちょっとわかりにくいですが、簡単に言うと、あるオブジェクト（＝サービス）を別のオブジェクト（＝クライアント）に渡すパターンがDIパターンです。

[http://blog.a-way-out.net/blog/2015/08/31/your-dependency-injection-is-wrong-as-I-expected/](http://blog.a-way-out.net/blog/2015/08/31/your-dependency-injection-is-wrong-as-I-expected/)

# インスタンスを誰が渡すのか

実際には先ほどの例のように、「インターフェースを定義して、コンストラクタで渡せばDIができてOK」とはなりません。実際にはどこかでコンストラクタに具象型を渡す必要があります。

例えば以下のように、複雑な依存関係になった時、都度コンストラクタで全てのサービスを渡してあげる必要があり、手動で解決するには限界が出てきます。

```java
    Writer writerA = new FooWriterA();
    Writer writerB = new FooWriterB(); 
    Writer writerC = new FooWriterC();
    ...


    BarService barService = new BarService(writerA, WriterB, WriterC, ...);
```

このように都度コンストラクタで全てのサービスを渡すのは現実的ではありません。これを解決するために現れた手段が、「サービスロケーター」と「DIコンテナ」です。

# DIとService Locator

DIと近い実装パターンとして、Service Locatorというパターンがあります。

結論としては、IoC（制御の反転）の概念の延長線上にあり、どちらもクラス間の密結合度を緩和するための手段として用いられるもの、という理解でよいかと思います。

現在はテストの困難さからService Locatorはアンチパターンのように論じられていることが多く、DIを用いた設計が行われていることが多いかと思っています。

ここではそれぞれの実装がどのようなものになるのかを捉えつつ、DIの特徴について深掘りしていきたいと思います。

## Service Locatorを作成する

Service Locatorについて要約すると、以下のような特徴があるようです

- Service Locatorという一元管理クラスが存在する
- その他のクラスはService Locatorに対してインスタンスを要求する
- そのインスタンス生成にかかる処理はすべてService Locatorの内部で行われる
- そのため、各クラスが個別にインスタンス生成処理を実施する必要がなくなる

以下はwikiediaからの引用になります

> The **service locator pattern** is a [design pattern](https://en.wikipedia.org/wiki/Design_pattern_(computer_science)) used in [software development](https://en.wikipedia.org/wiki/Software_development_tool) to encapsulate the processes involved in obtaining a service with a strong [abstraction layer](https://en.wikipedia.org/wiki/Abstraction_layer). This pattern uses a central registry known as the "service locator", which on request returns the information necessary to perform a certain task.[[1]](https://en.wikipedia.org/wiki/Service_locator_pattern#cite_note-1) Proponents of the pattern say the approach simplifies component-based applications where all dependencies are cleanly listed at the beginning of the whole application design, consequently making traditional dependency injection a more complex way of connecting objects. Critics of the pattern argue that it is an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern#Software_design) which obscures dependencies and makes software harder to test.

サービス・ロケータ・パターンは、ソフトウェア開発で使われるデザイン・パターンで、サービスを取得するためのプロセスを強力な抽象化レイヤでカプセル化する。 このパターンでは、「サービス・ロケータ」として知られる中央レジストリを使用し、要求に応じて、特定のタスクを実行するために必要な情報を返す[1]。このパターンの支持者は、このアプローチによって、すべての依存関係がアプリケーション設計全体の最初にきれいにリストされるコンポーネントベースのアプリケーションが単純化され、その結果、従来の依存性注入がオブジェクトを接続するのにより複雑な方法になると言う。 このパターンの批判者は、依存関係をあいまいにし、ソフトウェアをテストしにくくするアンチパターンだと主張する。

出典: [https://en.wikipedia.org/wiki/Service_locator_pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)

Service Locatorとは、「依存先のオブジェクトの解決を行う責務を担うクラス」のことです。

多くのものは専用のstatic classを定義して、型をキーにした解決を行います。

具体的な実装については、以下のコンポーネントで構成されます。

- Client - サービス・コンシューマー (消費者側) であり、Service Locatorからのリクエストを呼び出す役割を担う
- Service Locator - キャッシュからサービスを返すための通信エントリポイント
- Cache - サービスの参照を後で再利用するために保存するオブジェクト
- Initializer - キャッシュ内のサービスへの参照を作成し、登録する
- Service - 元のサービスまたは実装を表す

ここでは簡単な例をもとに、Service Locatorパターンを実装してみます。

以下の記事を参考にしています。

[https://www.baeldung.com/java-service-locator-pattern](https://www.baeldung.com/java-service-locator-pattern)

まずは、MessagingServiceインターフェースを作成。

```java
package org.example.servicelocator;

/**
 * 様々な方法でメッセージを送信するためのinterface
 */
public interface MessagingService {
  String getMessageBody();
  String getServiceName();
}
 
```

次に、EmailとSMSでメッセージを送信する、上記のインターフェースの2つの実装を定義します。

```java
package org.example.servicelocator;

public class EmailService implements MessagingService {
  @Override
  public String getMessageBody() {
    return "email message!";
  }

  @Override
  public String getServiceName() {
    return "EmailService";
  }
}

```

```java
package org.example.servicelocator;

public class SMSService implements MessagingService {
  @Override
  public String getMessageBody() {
    return "SMS message!";
  }

  @Override
  public String getServiceName() {
    return "SMSService";
  }
}

```

2つのサービスを定義したら、それらを初期化するロジックを定義します。

```java
package org.example.servicelocator;

/**
 * 定義した各Serviceを初期化するロジック
 */
public class InitialContext {
  public Object lookup(String serviceName) {
    if (serviceName.equalsIgnoreCase("EmailService")) {
      return new EmailService();
    } else if (serviceName.equalsIgnoreCase("SMSService")) {
      return new SMSService();
    }
    return null;
  }
}

```

Service Locator オブジェクトをまとめる前に、Cacheコンポーネントを定義します。

```java
package org.example.servicelocator;

import java.util.ArrayList;
import java.util.List;

public class Cache {
  private List<MessagingService> services = new ArrayList<>();

  public MessagingService getService(String serviceName) {
    for (MessagingService service : services) {
      if (service.getServiceName().equalsIgnoreCase(serviceName)) {
        System.out.println("Returning cached  " + serviceName + " object");
        return service;
      }
    }

    return null;
  }

  public void addService(MessagingService newService){
    boolean exists = false;

    for (MessagingService service : services) {
      if(service.getServiceName().equalsIgnoreCase(newService.getServiceName())){
        exists = true;
      }
    }
    if(!exists){
      services.add(newService);
    }
  }

}

```

最後に、Service Locatorクラスを実装します。

```java
package org.example.servicelocator;

/**
 * ServiceLocatorクラス
 * - description
 * このクラスは、Cache のインスタンスを保持します。
 * 次に、getService() メソッドで、最初にサービスのインスタンスのキャッシュをチェックします。
 * もしそれがNULLなら、初期化ロジックを呼び出し、新しいオブジェクトをキャッシュに追加する。
 */
public class ServiceLocator {
  private static Cache cache = new Cache();
  public static MessagingService getService(String serviceName) {
    MessagingService service = cache.getService(serviceName);

    if (service != null) {
      return service;
    }

    InitialContext context = new InitialContext();
    MessagingService service1 = (MessagingService) context.lookup(serviceName);
    cache.addService(service1);
    return service1;
  }
}

```

実際に実行してみると、以下のようになります

```java
        MessagingService service = ServiceLocator.getService("EmailService");
        String email = service.getMessageBody();
        System.out.println(email);

        MessagingService smsService = ServiceLocator.getService("SMSService");
        String sms = smsService.getMessageBody();
        System.out.println(sms);

        MessagingService emailService = ServiceLocator.getService("EmailService");
        String newEmail = emailService.getMessageBody();
        System.out.println(newEmail);
```

結果

```java
email message!
SMS message!
Returning cached  EmailService object
email message!
```


[https://knmts.com/as-a-engineer-147/](https://knmts.com/as-a-engineer-147/)

[https://teratail.com/questions/49143](https://teratail.com/questions/49143)

一旦はここまで。

SpringとDIについても書いていきたい。

# 参考

[https://kakutani.com/trans/fowler/injection.html](https://kakutani.com/trans/fowler/injection.html)

[https://zenn.dev/nuits_jp/articles/2024-05-22-why-dependency-injection](https://zenn.dev/nuits_jp/articles/2024-05-22-why-dependency-injection)

[https://qiita.com/ts7i/items/51a0b0b2c8a3b6e625f7](https://qiita.com/ts7i/items/51a0b0b2c8a3b6e625f7)

[https://kakutani.com/trans/fowler/injection.html](https://kakutani.com/trans/fowler/injection.html)

[https://qiita.com/tassi-yuzukko/items/a81a7b9aaa42198df689](https://qiita.com/tassi-yuzukko/items/a81a7b9aaa42198df689)

[https://knmts.com/as-a-engineer-147/](https://knmts.com/as-a-engineer-147/)

[https://annulusgames.com/blog/dependency-injection/](https://annulusgames.com/blog/dependency-injection/)