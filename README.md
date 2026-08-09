# trap.mofumofu.me

男の娘トークン (TRAP) プロジェクトサイト。WordPress (Parallax One テーマ) から
静的サイトへ移行し、旧サイトのワンページデザインを再現したもの。

- **Author**: ROZ-MOFUMOFU-ME \<mail@mofumofu.me\>
- **Stack**: TypeScript 7 / React 19 / Vite 8 / Tailwind CSS 4 / React Router 8
- **Host**: Cloudflare Workers (Static Assets)
- **URL**: https://trap-mofumofu-me.mofumofu.workers.dev

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

**main への push で GitHub Actions が自動デプロイする**
（[.github/workflows/deploy.yml](.github/workflows/deploy.yml)）。

必要なリポジトリシークレット:

| 名前                    | 内容                                                     |
| ----------------------- | -------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | 「Cloudflare Workers を編集」権限のトークン（IP 制限なし） |
| `CLOUDFLARE_ACCOUNT_ID` | アカウント ID（32 桁の英数字）                            |

手動でデプロイする場合:

```bash
pnpm exec wrangler login   # 初回のみ
pnpm deploy                # build して wrangler deploy
```

独自ドメイン（`trap.mofumofu.me`）の割り当ては Cloudflare ダッシュボードの
Workers & Pages → 対象 Worker → Settings → Domains & Routes から行う。

## コンテンツ

記事・固定ページは `src/content/site.json`。型は `src/content/types.ts`。

画像は `public/wp-content/uploads/` に配置し、**WordPress 時代と同じ URL パス**
で配信される。旧記事 URL（日本語カテゴリを含むパス）も `App.tsx` でルートを
生成しており、既存リンクからの流入を維持している。

| 種類       | パス                                         |
| ---------- | -------------------------------------------- |
| トップ     | `/`（旧テーマ同様のワンページ構成）          |
| 記事個別   | `/news/:id/`・`/hello-world/` などの旧 URL   |
| 固定ページ | `/contact/` `/privacy/`                      |

## 構成メモ

- SPA のため、Cloudflare 側で 404 を `index.html` にフォールバックさせている
  （`wrangler.jsonc` の `not_found_handling`）。
- 記事本文は WordPress 由来の HTML をそのまま描画。スタイルは
  `src/index.css` の `.prose-wp` に集約している。
- お問い合わせフォームは移行にあたり停止し、SNS への導線に置き換えてある。
