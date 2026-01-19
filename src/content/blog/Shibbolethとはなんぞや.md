---
title: "Shibbolethとはなんぞや"
id: t3ae6dd
public: true
publishedAt: 2023-10-19
editedAt: null
description: "言葉の整理を目的とした記事です。 Shibbolethとは Shibboleth（シボレス）とは、Web上でフェデレーション・シングルサインオン（SSO）を実現する、標準的なオープンソースソフトウェア"
tags:
  - 認証
---


言葉の整理を目的とした記事です。

## Shibbolethとは

Shibboleth（シボレス）とは、Web上でフェデレーション・シングルサインオン（SSO）を実現する、標準的なオープンソースソフトウェアのパッケージのこと。

- Webのオンライン情報への個別アクセスに対して、個人情報を保護する
- 個人情報に基づきアクセスを許可する**SAMLのフェデレーション認証方法**

Shibbolethを用いた認証をShibboleth認証と呼ぶ。

## 毎度記憶から抜け落ちる「フェデレーション」

毎度なんやっけ、となるのであえて書きます。

フェデレーションとは、複数のインターネット サービス間のユーザー認証連携を意味する。

一般的な用語としては、「連邦」や「連合」のことを指している。

フェデレーションを実現するための方法（プロトコル）として、「SAML（Security Assertion Markup Language）」がある。

異なるインターネットドメイン間で認証を行うことを「SSO（Single Sign On）」という。

SAMLはSSOを実現するための標準化された仕組み。

Shibbolethは「IDフェデレーション」を実現するための認証・認可基盤アーキテクチャ。

SAMLをベースとしており、高等教育機関や学術出版社などで主に用いられている。日本の大学や、国立情報学研究所（通称NII）が共同で運営している「学術認証フェデレーション（学認）」は、このShibbolethを基盤として動いている。

## Shibbolethのアーキテクチャ

> シボレスはウェブ上の技術であり、[SAML](https://ja.wikipedia.org/wiki/Security_Assertion_Markup_Language) のプロファイルを投入するための HTTP/POST リクエスト、データ構造、属性を実装している。**アイデンティティ・プロバイダ** ([英語](https://ja.wikipedia.org/wiki/%E8%8B%B1%E8%AA%9E): identity provider; IdP) と**サービス・プロバイダ** ([英語](https://ja.wikipedia.org/wiki/%E8%8B%B1%E8%AA%9E): service provider; SP) というコンポーネントで構成される。シボレス1.3版は技術概要[[3]](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%9C%E3%83%AC%E3%82%B9#cite_note-3)、アーキテクチャ文書[[4]](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%9C%E3%83%AC%E3%82%B9#cite_note-4)、適合性文書[[5]](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%9C%E3%83%AC%E3%82%B9#cite_note-5)に基づき、SAML 仕様1.1版の上に構築される。

> シボレス2.0版は SAML 標準2.0版の上に構築される。シボレス2.0版の IdP では、SAML 2.0版の受動認証要求や強制認証要求に対応した追加の処理を行わなければならない。SP が IdP に対して特定の認証方式を要求できる。シボレス2.0版ではほかに、通信の暗号化に対応している。またセッションの期間を初期値で30分としている。

引用: [https://ja.wikipedia.org/wiki/シボレス](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%9C%E3%83%AC%E3%82%B9)

SAMLプロトコルをベースとしており、IdPとSPによって構成されている。


## SAML殴り書き

超端的に言えば、IdPとは「証明する側」で、SPは「証明を確認する側」のこと。

「証明するためのもの」として、SAMLアサーションがあり、クライアントはこの「証明するためのもの」を持っているといろんなSPにアクセスすることが可能になる。

例えば海外旅行だと、自分の国（日本）からアメリカに行く際には「パスポート」が必要になる。もしパスポートを持ってないままアメリカに行ってしまうと、認証が行えないため自分の国へ「強制的に送還（リダイレクト）」されてしまう。もしパスポートを持っていれば、それを見せることによって「自国で身分を証明された人ですよ」と言うことを入国管理局の人に伝えることができる。結果、入国することができる。

この場合

- 母国が「IDプロバイダー」
- 入国管理局の人が「RP（リライングパーティー）」
- 入国しようとしているアメリカが「SP（サービスプロバイダー）」
- パスポートが「SAMLアサーション」

ということができる。

## アサーションとはなんなのか

SAMLの仕組みの中では、HTTPリクエストに乗せて以下のようなXML形式の証明書が飛び交う。

```javascript
<samlp:Response ID="_257f9d9e9fa14962c0803903a6ccad931245264310738" 
   IssueInstant="2009-06-17T18:45:10.738Z" Version="2.0">
<saml:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">
   https://www.salesforce.com
</saml:Issuer>

<samlp:Status>
   <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
</samlp:Status>

<saml:Assertion ID="_3c39bc0fe7b13769cab2f6f45eba801b1245264310738" 
   IssueInstant="2009-06-17T18:45:10.738Z" Version="2.0">
   <saml:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">
      https://www.salesforce.com
   </saml:Issuer>

   <saml:Signature>
      <saml:SignedInfo>
         <saml:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
         <saml:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
         <saml:Reference URI="#_3c39bc0fe7b13769cab2f6f45eba801b1245264310738">
            <saml:Transforms>
               <saml:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
               <saml:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
                  <ec:InclusiveNamespaces PrefixList="ds saml xs"/>
               </saml:Transform>
            </saml:Transforms>
            <saml:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
            <saml:DigestValue>vzR9Hfp8d16576tEDeq/zhpmLoo=
            </saml:DigestValue>
         </saml:Reference>
      </saml:SignedInfo>
      <saml:SignatureValue>
         AzID5hhJeJlG2llUDvZswNUrlrPtR7S37QYH2W+Un1n8c6kTC
         Xr/lihEKPcA2PZt86eBntFBVDWTRlh/W3yUgGOqQBJMFOVbhK
         M/CbLHbBUVT5TcxIqvsNvIFdjIGNkf1W0SBqRKZOJ6tzxCcLo
         9dXqAyAUkqDpX5+AyltwrdCPNmncUM4dtRPjI05CL1rRaGeyX
         3kkqOL8p0vjm0fazU5tCAJLbYuYgU1LivPSahWNcpvRSlCI4e
         Pn2oiVDyrcc4et12inPMTc2lGIWWWWJyHOPSiXRSkEAIwQVjf
         Qm5cpli44Pv8FCrdGWpEE0yXsPBvDkM9jIzwCYGG2fKaLBag==
      </saml:SignatureValue>
      <saml:KeyInfo>
         <saml:X509Data>
            <saml:X509Certificate>
               MIIEATCCAumgAwIBAgIBBTANBgkqhkiG9w0BAQ0FADCBgzELM
               [Certificate truncated for readability...]
            </saml:X509Certificate>
         </saml:X509Data>
      </saml:KeyInfo>
   </saml:Signature>

   <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">
         saml01@salesforce.com
      </saml:NameID>

      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
      <saml:SubjectConfirmationData NotOnOrAfter="2009-06-17T18:50:10.738Z" 
         Recipient="https://login.salesforce.com"/>
      </saml:SubjectConfirmation>
   </saml:Subject>

   <saml:Conditions NotBefore="2009-06-17T18:45:10.738Z" 
      NotOnOrAfter="2009-06-17T18:50:10.738Z">

      <saml:AudienceRestriction>
         <saml:Audience>https://saml.salesforce.com</saml:Audience>
      </saml:AudienceRestriction>
   </saml:Conditions>

   <saml:AuthnStatement AuthnInstant="2009-06-17T18:45:10.738Z">
      <saml:AuthnContext>
         <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified
         </saml:AuthnContextClassRef>
      </saml:AuthnContext>
   </saml:AuthnStatement>

   <saml:AttributeStatement>

      <saml:Attribute Name="portal_id">
         <saml:AttributeValue xsi:type="xs:anyType">060D00000000SHZ
         </saml:AttributeValue>
      </saml:Attribute>

      <saml:Attribute Name="organization_id">
         <saml:AttributeValue xsi:type="xs:anyType">00DD0000000F7L5
         </saml:AttributeValue>
      </saml:Attribute>

      <saml:Attribute Name="ssostartpage" 
         NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified">

         <saml:AttributeValue xsi:type="xs:anyType">
            http://www.salesforce.com/security/saml/saml20-gen.jsp
         </saml:AttributeValue>
      </saml:Attribute>

      <saml:Attribute Name="logouturl" 
         NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">

         <saml:AttributeValue xsi:type="xs:string">
            http://www.salesforce.com/security/del_auth/SsoLogoutPage.html
         </saml:AttributeValue>
      </saml:Attribute>
   </saml:AttributeStatement>
</saml:Assertion>
</samlp:Response>
```

引用 [https://developer.salesforce.com/docs/atlas.ja-jp.sso.meta/sso/sso_saml_assertion_examples.htm](https://developer.salesforce.com/docs/atlas.ja-jp.sso.meta/sso/sso_saml_assertion_examples.htm)

この「アサーション」には、たとえばsignatureValueというような、署名情報だったり

```javascript
　　　　　　　　	<saml:SignatureValue>
         AzID5hhJeJlG2llUDvZswNUrlrPtR7S37QYH2W+Un1n8c6kTC
         Xr/lihEKPcA2PZt86eBntFBVDWTRlh/W3yUgGOqQBJMFOVbhK
         M/CbLHbBUVT5TcxIqvsNvIFdjIGNkf1W0SBqRKZOJ6tzxCcLo
         9dXqAyAUkqDpX5+AyltwrdCPNmncUM4dtRPjI05CL1rRaGeyX
         3kkqOL8p0vjm0fazU5tCAJLbYuYgU1LivPSahWNcpvRSlCI4e
         Pn2oiVDyrcc4et12inPMTc2lGIWWWWJyHOPSiXRSkEAIwQVjf
         Qm5cpli44Pv8FCrdGWpEE0yXsPBvDkM9jIzwCYGG2fKaLBag==
      </saml:SignatureValue>
```

subjectという、セキュリティドメインにおける認証/承認の対象となる実体だったり

```javascript
   <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">
         saml01@salesforce.com
      </saml:NameID>

      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
      <saml:SubjectConfirmationData NotOnOrAfter="2009-06-17T18:50:10.738Z" 
         Recipient="https://login.salesforce.com"/>
      </saml:SubjectConfirmation>
   </saml:Subject>
```

が記載されている。


一旦ここまでで、随時書き足したりするかもしれません。

## 参考

[https://hnakamur.github.io/blog/2018/07/04/saml2-single-sign-on-with-nginx-and-shibboleth/](https://hnakamur.github.io/blog/2018/07/04/saml2-single-sign-on-with-nginx-and-shibboleth/)

[https://qiita.com/osak/items/1a8e976146b39ad1059f](https://qiita.com/osak/items/1a8e976146b39ad1059f)