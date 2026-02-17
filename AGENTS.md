# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際のAIエージェントへの指針を提供します。

## 必須ルール

### Worktree必須
コード変更を伴う作業は、**必ず git worktree を作成してから開始すること**。メインのリポジトリディレクトリでは直接コード変更を行わない。

```bash
# 1. worktreeを作成
git worktree add ../myblog-<branch-name> -b <branch-name>

# 2. settings.local.jsonをコピー（権限設定のため必須）
mkdir -p ../myblog-<branch-name>/.claude
cp .claude/settings.local.json ../myblog-<branch-name>/.claude/
```

### データ
blogの記事は `src/content/blog` に格納されている。このコンテンツはソースコードを編集する際には一切編集しないこと。
静的ビルドによってこのコンテンツを読み取ります。

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動
npm run build     # ビルド
npm run lint      # リントチェック (ESLint)
npm run lint:fix  # ESLint自動修正
npm run format    # Prettierチェック
npm run format:fix # Prettier自動フォーマット
```

## アーキテクチャ

- **フレームワーク**: Astro 5 (SSG)
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript (strict)
- **リンター/フォーマッター**: ESLint / Prettier

## 主要ディレクトリ構造

```
src/
├── components/      # 共通コンポーネント
├── content/
│   └── blog/        # ブログ記事（Markdown/MDX）
├── layouts/         # レイアウトテンプレート
├── libs/            # ユーティリティ・Markdownプラグイン
├── pages/           # ページルーティング（Astroファイル、RSS等）
├── scripts/         # ユーティリティスクリプト
└── styles/          # グローバルCSS
```

詳細は [プロジェクト概要](docs/プロジェクト概要.md) を参照。
