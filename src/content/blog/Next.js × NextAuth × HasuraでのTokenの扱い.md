---
title: "Next.js × NextAuth × HasuraでのTokenの扱い"
id: t3xmxsk
public: true
publishedAt: 2023-09-06
editedAt: null
description: "現象 個人開発中に遭遇した現象についてのメモ書き。 NextAuthでGoogleのOAuthを利用してログインしたところ、本来であれば取れているはずの一覧データが取れていない。 Hasuraに対する"
tags:
  - 個人開発
  - Hasura
  - Next.js
---


## 現象

個人開発中に遭遇した現象についてのメモ書き。

NextAuthでGoogleのOAuthを利用してログインしたところ、本来であれば取れているはずの一覧データが取れていない。

Hasuraに対するリクエストを見てみると…

![](_images/Untitled%2025.png)

どうやらアクセスを認可するためのAuthorizarionヘッダーにトークンがセットされていない模様。

この状態で同じような一覧を取得する別のページに遷移してみると、今度はAuthorizationヘッダにTokenがセットされているため、データの取得を問題なく行うことができた。

いろいろ検証してみた結果、問題は初回のリクエスト時にのみ発生しているらしい。

![](_images/Untitled%2026.png)

ちなみに実装はこんな感じ

_app.tsx

```javascript
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider, getSession } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { ClientProvider } from "@/components/client";
import { GetServerSideProps } from "next";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  console.log("pageProps", session, pageProps);
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ClientProvider>
          <Component {...pageProps} />
        </ClientProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}
```

client.tsx

```javascript
import { initializeApollo } from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  console.log("session", session);
  const client = initializeApollo(session.data?.user?.accessToken ?? "");
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
```

apolloClient.ts

```javascript
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "cross-fetch/polyfill";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT,
});

let token = "";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;
const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
export const initializeApollo = (accessToken: string) => {
  token = accessToken;
  console.log("token", token);
  const _apolloClient = apolloClient ?? createApolloClient();
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};
```

コンソールのログ（サーバーサイド）

![](_images/Untitled%2027.png)

ブラウザ側

![](_images/Untitled%2028.png)

初回のGraphQLリクエストが走る際、”token”として出力しているアクセストークンには値が入っていない。

そして、NextAuth側のsessionをセットするための関数内でencodedTokenの文字列でconsole.logを実行しているが、こちらではすでにTokenがセットされている。

また、調べた結果 client.tsxで使用しているuseSession関数は、サーバーサイドレンダリング時には使用できないらしい。

[https://next-auth.js.org/getting-started/client#usesession](https://next-auth.js.org/getting-started/client#usesession)

つまりここから推測するに、

- sessionがセットされる前のSSR時にApollo Clientの設定関数 (initializeApollo) が実行される。
- tokenはundifindで渡っているのでsetContext関数内にあるAuthorizationヘッダにはtokenがない状態で初期設定される
- tokenなしでリクエストしているため、アクセスの認可が通らずデータが取得できない
- 別ページに遷移して際レンダリングされた際には、Cookiesにtoken情報を持っているため、useSessionでアクセスしてtokenを取得できる
- 今度はAuthorizationヘッダにtokenが渡るため、リクエスト時に認可が通ってデータ取得が可能となる

こんな感じの現象が起こっていたっぽい…。

## 解決法

解決？ なのかわからないが以下のやり方で状況が改善した。

### getServerSidePropsでsessionを取得する

index.tsx内にgetServerSidePropsを追記

```javascript
import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";

import { GET_ALL_EVENTS } from "@/queries/queries";
import { GetAllEventsQuery } from "@/types/generated/graphql";
import { EventIndex } from "@/components/page/Events";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

// ダッシュボード
export default function Home() {
  const router = useRouter();

  // TODO: パラメーター仮置き
  const { data } = useQuery<GetAllEventsQuery>(GET_ALL_EVENTS, {
    variables: { event_date: "2023-04-01" },
  });

  const handleEdit = (editEventKey: string) => {
    router.push(`/detail/${editEventKey}`);
  };

  return (
    <EventIndex title="イベント一覧" data={data} handleEvent={handleEdit} />
  );
}

// 追加
export const getServerSideProps: GetServerSideProps<{ context: any }> = async (
  context: any
) => {
  const session = await getSession(context);

  return {
    props: { session },
  };
};
```

これ以外にも何かいい方法があるのか、ちょっといろいろと模索していきたい（なんかあったら追記していく）