# trap.mofumofu.me

男の娘トークン (TRAP) プロジェクトサイト。WordPress から静的サイトへ移行したもの。

- **Author**: ROZ-MOFUMOFU-ME \<mail@mofumofu.me\>
- **Stack**: TypeScript 7 / React 19 / Vite 8 / Tailwind CSS 4 / React Router 8
- **Host**: Cloudflare Workers (Static Assets)

## 開発

```bash
pnpm install
pnpm dev          # http://127.0.0.1:5173
```

## ビルド・型チェック

```bash
pnpm typecheck    # tsc --noEmit
pnpm build        # 型チェック + vite build -> dist/
pnpm preview      # dist/ をローカル確認
```

## デプロイ（Cloudflare）

初回のみ認証:

```bash
pnpm exec wrangler login
```

デプロイ:

```bash
pnpm deploy       # build して wrangler deploy
```

独自ドメイン（`trap.mofumofu.me`）の割り当ては Cloudflare ダッシュボードの
Workers & Pages → 対象 Worker → Settings → Domains & Routes から行う。

## コンテンツ

記事・固定ページは `src/content/site.json`。型は `src/content/types.ts`。

画像は `public/wp-content/uploads/` に配置し、**WordPress 時代と同じ URL パス**
で配信される。旧記事 URL（日本語カテゴリを含むパス）も `App.tsx` でルートを
生成しており、既存リンクからの流入を維持している。

| 種類       | パス                        |
| ---------- | --------------------------- |
| お知らせ   | `/news/`                    |
| 記事個別   | `/news/:id/` および旧 URL   |
| 固定ページ | `/contact/` `/privacy/`     |

## 構成メモ

- SPA のため、Cloudflare 側で 404 を `index.html` にフォールバックさせている
  （`wrangler.jsonc` の `not_found_handling`）。
- 記事本文は WordPress 由来の HTML をそのまま描画。スタイルは
  `src/index.css` の `.prose-wp` に集約している。
- お問い合わせフォームは移行にあたり停止し、SNS への導線に置き換えてある。
