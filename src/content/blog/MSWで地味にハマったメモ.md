---
title: "MSWで地味にハマったメモ"
id: t3uv0iy
public: true
publishedAt: 2024-05-21
editedAt: null
description: "MSWのv2の導入でハマったことのメモ。 環境 javascript \"react\": \"^18.2.0\", \"vite\": \"^4.3.2\" \"msw\": \"^2.3.0\", バックエンドのAPIが"
tags:
  - React
  - MSW
  - memo
---


MSWのv2の導入でハマったことのメモ。

# 環境

```javascript
 "react": "^18.2.0",
 "vite": "^4.3.2"
 "msw": "^2.3.0",
```

バックエンドのAPIがまだ開発されていない段階で、フロントエンドのUIを作成することになったため、効率的に開発を進めるためにMSWを導入した。

以下のような形で `handler.ts` と `browser.ts` を用意し、main.tsxにセットアップ

handler.ts

```javascript
import { http, HttpResponse, type ResponseResolver } from 'msw'

const mockTest: ResponseResolver = () => {
  return HttpResponse.json(
    {
      text: "test"
    }
  )
}

export const handlers = [
  http.get(`http://localhost:8000/test`, mockTest),
  http.get(`http://localhost:8000/ping`, mockTest),

```

browser.ts

```javascript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export async function setupMsw() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
    const worker = setupWorker(...handlers)
    worker.start()
  }
}

```

main.tsx

```javascript
import { createRoot } from "react-dom/client";
import React from "react";
import { Routes } from "@generouted/react-router";
import { setupMsw } from "./mocks/browser";

// VITE_USE_MSWがtrueまたはdevで実行時のみ、MSWが起動
setupMsw()

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;

createRoot(container).render(
    <React.StrictMode>
        <Routes />
    </React.StrictMode>
);

```

## 何がおこったか

```javascript
import React, { useEffect } from "react";

function TestIndexPage() {
      useEffect(() => {
        (async () => {

        const fet = await fetch("http://localhost:8000/test")
        const res = await fet.json()
        console.log("fet", res)
        const ping = await fetch("http://localhost:8000/ping")
        const pingres = await ping.json()
        console.log("pingres", pingres)
        })()
      }, [])
    return (
        <div>
          <p>test</p>
        </div>
    );
}

export default TestIndexPage;
```

Testページで上記のようにfetchすると、/testは404になるが、/pingはMSWでセットしたレスポンスが返るようになっていた。

## 結論

MSWのworker.setup() は非同期処理のため、setupが終了する前にレンダリングが実行され、初回のリクエスト時 (/testのfetch時) はまだworkerが動いていなかったため。

こんな感じで、遅れて「Mocking Enabled」が表示される

![](_images/Untitled%202.png)

以下のように、browser.tsとmain.tsxでの記述を、worker.start() の非同期処理終了後にレンダリングするようにして解決。

browser.ts

```javascript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export async function setupMsw() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
    const worker = setupWorker(...handlers)
    await worker.start()
  }
}

```

main.tsx

```javascript
import { createRoot } from "react-dom/client";
import React from "react";
import { Routes } from "@generouted/react-router";
import { setupMsw } from "./mocks/browser";



// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("root")!;

// VITE_USE_MSWがtrueまたはdevで実行時のみ、MSWが起動
setupMsw().then(() => {
		createRoot(container).render(
		    <React.StrictMode>
		        <Routes />
		    </React.StrictMode>
			);
})
```


無駄にハマったので自戒としてメモ…

参考

[https://zenn.dev/ryo_kawamata/articles/mock-api-server-with-msw#service-workerのスタート処理の追加](https://zenn.dev/ryo_kawamata/articles/mock-api-server-with-msw#service-workerのスタート処理の追加)

[https://mswjs.io/docs/integrations/browser#conditionally-enable-mocking](https://mswjs.io/docs/integrations/browser#conditionally-enable-mocking)

[https://medium.com/@leuzga/setting-up-a-react-project-with-vite-and-msw-for-api-mocking-2674469cdbb1](https://medium.com/@leuzga/setting-up-a-react-project-with-vite-and-msw-for-api-mocking-2674469cdbb1)