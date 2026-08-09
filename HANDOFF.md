# 引き継ぎ書 — fiume.co / trap.mofumofu.me の静的サイト化

作成: 2026-08-09 / 作業環境: WSL (Debian 12, `/home/aoi`)

---

## 1. いま何ができているか

WordPress から抽出したコンテンツで、**両サイトとも React アプリとしてビルドが通り、ローカルで表示確認済み**の状態です。

| リポジトリ | パス | 状態 |
| --- | --- | --- |
| fiume.co | `/home/aoi/fiume.co` | ✅ ビルド成功・型エラーなし |
| trap.mofumofu.me | `/home/aoi/trap.mofumofu.me` | ✅ ビルド成功・型エラーなし |

検証済みの内容（`vite preview` で確認）:

- 全ルートが 200（`/` `/about/` `/works/` `/diary/` `/link/` `/contact/`）
- 日本語コンテンツが正しくバンドルされている
- 画像が `/wp-content/uploads/...` で配信される（WordPress と同じパス）
- Tailwind のトークンが CSS に出力されている

**未実施: Cloudflare へのデプロイ**（`wrangler login` が対話認証のため）。

---

## 2. 技術スタック

要求どおりの構成で、すべて最新版が入っています。

| 種類 | バージョン |
| --- | --- |
| TypeScript | 7.0.2 |
| Tailwind CSS | 4.3.3（`@tailwindcss/vite` プラグイン、CSS-first 設定） |
| React | 19.2.8 |
| Vite | 8.2.1（rolldown ベース） |
| React Router | 8.3.0 |
| Wrangler | 4.120.0 |
| Node | 24.19.0（`n` 管理、`~/.n/bin`） |
| pnpm | 11.20.0（corepack、WSLネイティブ） |

### git author

リポジトリごとにローカル設定済み（グローバル設定は変更していません）。

```
fiume.co          Aoi Asakawa <aoi@fiume.co>
trap.mofumofu.me  ROZ-MOFUMOFU-ME <mail@mofumofu.me>
```

---

## 3. ディレクトリ構成

```
fiume.co/
├── package.json          scripts: dev / build / typecheck / deploy
├── tsconfig.json         strict + verbatimModuleSyntax
├── vite.config.ts        react + tailwindcss プラグイン
├── wrangler.jsonc        Workers Static Assets 設定
├── pnpm-workspace.yaml   onlyBuiltDependencies (esbuild, workerd)
├── index.html
├── public/
│   ├── _headers          セキュリティヘッダ + キャッシュ制御
│   ├── favicon.svg
│   ├── robots.txt
│   └── wp-content/uploads/   ← 画像209ファイル（旧URLと同じパス）
└── src/
    ├── main.tsx
    ├── App.tsx           ルーティング定義
    ├── index.css         Tailwind4 @theme + .prose-wp
    ├── content/
    │   ├── site.json     ← 全コンテンツ（投稿・固定ページ・作品）
    │   └── types.ts
    ├── components/
    │   ├── Layout.tsx    Header/Footer/Wrap/PageTitle/Prose
    │   └── Bits.tsx      EntryRow/WorkCard/Button/useMeta
    └── routes/
        └── Pages.tsx     各ページのコンポーネント
```

trap.mofumofu.me も同じ構成です（`routes/Pages.tsx` と `App.tsx` の中身が違うだけ）。

---

## 4. 移行したコンテンツ

WordPress の DB から `wp eval-file` で抽出し、`src/content/site.json` に格納しています。

| | fiume.co | trap.mofumofu.me |
| --- | --- | --- |
| 投稿 | 7 | 1 |
| 固定ページ | 6 | 2 |
| 作品（icf_portfolio） | 5 | — |
| メディア | 209 | 193 |

### URL は旧構造を維持しています

SEO と既存リンクを壊さないため、WordPress 時代のパスをそのまま使っています。

| 種類 | パス |
| --- | --- |
| 日記一覧 / 個別 | `/diary/` `/diary/:id/` |
| 作品一覧 / 個別 | `/works/` `/portfolio/:slug/` |
| 固定ページ | `/about/` `/sample/` `/link/` `/contact/` `/privacy/` |
| 画像 | `/wp-content/uploads/...` |

trap 側は旧記事URL（日本語カテゴリを含むパス）も `App.tsx` でルート生成し、`useLocation()` でパス照合して解決しています。

### 本文の扱い

記事本文は WordPress 由来の HTML をそのまま `dangerouslySetInnerHTML` で描画し、スタイルは `src/index.css` の `.prose-wp` に集約しています。抽出時に以下を処理済みです。

- 自ドメインの絶対URLを相対パスへ変換
- 本文に紛れ込んでいた `/wp-admin/` へのリンクを除去
- `<script>` タグを除去（Twitter 埋め込み等）
- 固定幅の inline style を除去（レスポンシブを壊すため）

---

## 4.5. 最初にやること — コミット（ステージ済み・未コミット）

**両リポジトリとも `git add -A` まで済ませてありますが、コミットはできていません。**

| リポジトリ | ステージ済み |
| --- | --- |
| fiume.co | 246 files |
| trap.mofumofu.me | 220 files |

理由は GPG 署名です。`commit.gpgsign = true` が設定されており、署名鍵が
**YubiKey**（`Card serial no. 0006 27232930`）のため、PIN 入力が必要です。
非対話シェルからは `Inappropriate ioctl for device` で失敗します。
署名を迂回する設定変更は行っていません。

VS Code のターミナル（対話可能）で以下を実行すれば、PIN 入力を経てコミットできます。

```bash
cd ~/fiume.co
export GPG_TTY=$(tty)          # 必要なら
git commit                      # メッセージは下記を参考に
```

コミットメッセージ案:

```
WordPress から React + Vite 構成へ移行

浅川あおい / TRAP のサイトを、WordPress の DB から抽出したコンテンツを
もとに再構築した。旧サイトは options テーブルの破損によりテーマ設定を
失っており、コンテンツ本体（投稿・固定ページ・作品・メディア）のみを
引き継いでいる。

- TypeScript 7 / React 19 / Vite 8 / Tailwind CSS 4 / React Router 8
- Cloudflare Workers Static Assets へデプロイする構成（wrangler.jsonc）
- 記事 URL と画像パスは WordPress 時代のものを維持し、既存リンクと
  検索エンジンのインデックスを壊さないようにしている
- 本文は WordPress 由来の HTML をそのまま描画し、スタイルは
  index.css の .prose-wp に集約
- お問い合わせフォームは静的化にともない停止し、SNS 導線に置き換え
```

なお **git の author はリポジトリごとにローカル設定済み**です
（グローバルの `Aoi Emerauda <aoi@emerauda.com>` は変更していません）。
署名鍵の UID は `aoi@emerauda.com` なので、コミットの author と署名者が
異なる状態になります。気になる場合は各リポジトリで
`git config user.signingkey` を設定してください。

---

## 5. コマンド

```bash
cd ~/fiume.co        # または ~/trap.mofumofu.me

pnpm dev             # 開発サーバー http://127.0.0.1:5173
pnpm typecheck       # tsc --noEmit
pnpm build           # 型チェック + vite build → dist/
pnpm preview         # dist/ をローカル確認
pnpm deploy          # build して wrangler deploy
```

**注意**: `pnpm` は必ず `~/.n/bin/pnpm`（WSLネイティブ）を使ってください。PATH の並びによっては Windows 側の `/mnt/c/Users/unsei/AppData/Roaming/npm/pnpm` が先に来ることがあり、そちらだとビルドが失敗します。

---

## 6. デプロイ手順（未実施・次にやること）

```bash
cd ~/fiume.co
pnpm exec wrangler login     # ブラウザで認証（対話）
pnpm deploy
```

`wrangler.jsonc` は **Workers Static Assets** 構成です。SPA なので存在しないパスは `index.html` にフォールバックします。

```jsonc
"assets": {
  "directory": "./dist",
  "not_found_handling": "single-page-application"
}
```

独自ドメインの割り当ては、Cloudflare ダッシュボードの Workers & Pages → 対象 Worker → Settings → Domains & Routes から。`wrangler.jsonc` 内のコメントアウトされた `routes` を有効化してもかまいません。

**デプロイ前に確認すること**: 現在 `fiume.co` / `trap.mofumofu.me` の DNS は Oracle Cloud の WordPress サーバー（158.101.135.30）を向いています。切り替えると WordPress 版は見えなくなります。

---

## 7. 引き継ぎ時点での注意点・既知の課題

### 対応済みだが記録しておくもの

- **Vite 8 の `manualChunks` はオブジェクト形式が使えません**（rolldown ベースのため関数のみ）。当初オブジェクトで書いてビルドが落ちたので削除済みです。
- **pnpm 10+ はビルドスクリプトを既定でブロック**します。`pnpm-workspace.yaml` の `onlyBuiltDependencies` に `esbuild` / `workerd` を指定済み。それでも `ERR_PNPM_IGNORED_BUILDS` が出る場合は `pnpm approve-builds --yes` を実行してください。
- **`package.json` の `pnpm` フィールドは新しい pnpm では読まれません**（`pnpm-workspace.yaml` に移動しました）。

### 未対応

- **お問い合わせフォームが機能しません。** 元は Contact Form 7 でしたが静的サイトでは動かないため、SNS への導線に置き換えてあります。フォームが必要なら Workers 側にエンドポイントを作る想定です（メール送信には外部サービスが必要）。
- **SSR / SSG は入れていません。** 現状は SPA なので、クローラーによっては初期HTMLに本文が入らない点が不利です。ページ数が21件と少ないので、必要なら prerender を足すのが現実的です。
- **サイトマップを生成していません。** 静的HTML版では出力していましたが、React 版では未実装です。
- **Works ページの元デザイン**（カルーセル）は再現せず、カードグリッドに置き換えています。

---

## 8. 元の WordPress サーバーについて（重要）

`158.101.135.30`（Oracle Cloud, oracle-tokyo02）で稼働中です。**今回の作業中に私が options テーブルを破壊しました。**

### 経緯

AIOS の設定を戻す際、`mysqldump --where=...` でバックアップを取りましたが、**mysqldump は既定で `DROP TABLE` を出力します**。それを復元時に流し込んだため、両サイトの `*_options` テーブルが AIOS の1行だけになりました。

### 復旧状況

- **投稿・固定ページ・メディア・ユーザーは無傷**（別テーブルのため影響なし）
- fiume.co は `wp-content/ai1wm-backups/` にあった 2025-03-18 の `.wpress` から options を復元
- trap.mofumofu.me はバックアップが無く、必須項目のみ手動再構築
- `user_roles` も失われていたため再作成（管理画面に入れなくなっていた）

### 失われたまま復旧できていないもの

- **Blackoot Pro のライセンスキー**（`blackoot_settings.ict_updates_key`）。販売元 iceablethemes.com は 2024年で更新が止まりメンテナンス画面のまま、更新APIも404で、再発行の窓口がありません。
- **テーマのカスタマイズ設定**（`theme_mods_*`）、ウィジェット配置、各プラグインの設定。

WordPress を今後も使うなら再設定が必要ですが、**このリポジトリへ移行するなら不要**です。

### バックアップの所在

サーバーの `/root/` に各段階のダンプが残っています。

```
/root/aiowps-FINAL-backup-20260809-205710.sql   AIOS設定（reCAPTCHAキー含む）
/root/wpress-extract/database.sql               2025-03の全DB（fiume.co）
/root/options-current-*.sql                     破壊直前のoptions
/root/nginx.conf-*                              nginx設定
/root/iptables-backup-*/                        ファイアウォール
```

**このサーバーには DB の定期バックアップがありません。** WordPress を残すなら日次 `mysqldump` の設定を強く推奨します。

---

## 9. サーバー側で今日入れた変更（WordPress を残す場合の情報）

移行が完了して WordPress を畳むなら不要ですが、記録として。

- nginx: `limit_req` を `100000r/m` → `12r/m`（ログインのブルートフォース対策）
- iptables: 80/443 を Cloudflare の22レンジのみに制限（`iptables-persistent` で永続化済み）
- nginx: `set_real_ip_from` + `real_ip_header CF-Connecting-IP`（訪問者の実IP復元）
- PHP-FPM: `pm.max_children` 5 → 20（「つながらない」現象の解消）
- Cloudflare WAF: ログインURLに Managed Challenge（両ゾーン。misskey.mofumofu.me は除外済み）
- Cloudflare Cache Rules: HTMLをエッジキャッシュ、ログイン中はバイパス

---

## 10. 作業用ファイルの場所（Windows 側）

抽出データと変換スクリプトは以下に残っています。コンテンツを取り直したい場合に使えます。

```
C:\Users\unsei\AppData\Local\Temp\claude\D--\1ca4e355-8c3f-487f-85e6-418ab4be79ae\
├── content-fiume.json / content-trap.json    WordPressからの抽出データ
├── cpt-fiume.json / cpt-trap.json            カスタム投稿タイプ（portfolio）
├── make-content.py                            → src/content/site.json を生成
├── build.py                                   静的HTML版のジェネレータ（参考）
└── repo/fiume, repo/trap                      WSLへ配置した雛形の元
```

**一時ディレクトリなので、必要なら永続的な場所へ退避してください。**
