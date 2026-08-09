import { useParams, useLocation, Link } from 'react-router'
import { useEffect, useRef } from 'react'
import content from '../content/site.json'
import type { SiteContent } from '../content/types'
import { Wrap, PageTitle, Lede, Prose } from '../components/Layout'
import {
  useMeta,
  Reveal,
  HeartIcon,
  IntersexIcon,
  PinIcon,
  TwitterIcon,
  MailIcon,
  UsersIcon,
} from '../components/Bits'

const site = content as SiteContent
const { posts } = site
const pageBySlug = (slug: string) => site.pages.find((p) => p.slug === slug)

const SITE_TITLE = '男の娘トークン - Otokonoko Token (TRAP)'
const SITE_DESC = '男の娘のための仮想通貨 - Crypto Curruncy for Crossdressers'

/* ============================== HOME ============================== */

const themeImg = '/wp-content/themes/Parallax-One-2.1.4/images'

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <Reveal dir="up" className="mb-12 text-center">
      <h2 className="mb-5 mt-2 text-[2rem] leading-tight text-heading sm:text-[2.4rem] sm:leading-[3.125rem]">
        {title}
      </h2>
      <span className="colored-line line-grow mx-auto" />
      <div className="mt-5 font-light text-fg-dim">{sub}</div>
    </Reveal>
  )
}

/**
 * SECTION: ヒーロー（旧テーマのパララックスヘッダー）
 * 背景 2 レイヤーがスクロールとマウスに追従する。
 */
function Hero() {
  const layer1 = useRef<HTMLDivElement>(null)
  const layer2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let mx = 0
    let my = 0
    let sy = 0

    const apply = () => {
      raf = 0
      // 旧テーマの depth 0.10 / 0.20 に合わせ、奥のレイヤーほどゆっくり動かす
      if (layer1.current) {
        layer1.current.style.transform = `translate3d(${mx * -12}px, ${sy * 0.15 + my * -8}px, 0) scale(1.08)`
      }
      if (layer2.current) {
        layer2.current.style.transform = `translate3d(${mx * -26}px, ${sy * 0.3 + my * -16}px, 0) scale(1.08)`
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onScroll = () => {
      sy = window.scrollY
      schedule()
    }
    const onMouse = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
      schedule()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header className="relative overflow-hidden">
      {/* パララックスの背景 2 レイヤー */}
      <div
        ref={layer1}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${themeImg}/background1.png)`, transform: 'scale(1.08)' }}
      />
      <div
        ref={layer2}
        className="absolute inset-0 bg-cover bg-bottom will-change-transform"
        style={{ backgroundImage: `url(${themeImg}/background2.png)`, transform: 'scale(1.08)' }}
      />
      {/* 旧サイトのカスタマイズ値 .overlay-layer-wrap { background: rgba(0,0,0,0.7) } */}
      <div className="relative flex min-h-svh items-center justify-center bg-black/70 px-4 py-24">
        <div className="text-center">
          <img
            src="/wp-content/uploads/2019/02/TRAP-1.png"
            alt="Otokonoko Token (TRAP)"
            width="450"
            height="450"
            className="hero-in animate-float mx-auto mb-10 w-[min(450px,70vw)] drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
          />
          <h2
            className="hero-in mb-4 text-[1.6rem] font-semibold leading-snug text-white sm:text-[2.2rem]"
            style={{ animationDelay: '0.2s' }}
          >
            男の娘トークン - Otokonoko Token (TRAP)
          </h2>
          <h5
            className="hero-in text-[1rem] font-light text-white/90 sm:text-[1.15rem]"
            style={{ animationDelay: '0.4s' }}
          >
            男の娘のための仮想通貨 - Crypto Curruncy for Crossdressers
          </h5>
        </div>
        {/* スクロール誘導 */}
        <a
          href="#services"
          aria-label="コンテンツへスクロール"
          className="hero-in absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
          style={{ animationDelay: '0.9s' }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-nudge h-9 w-9"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
    </header>
  )
}

/** SECTION: 男の娘トークン (TRAP) とは */
const services = [
  {
    icon: HeartIcon,
    title: '活動の支援 - Support of activity',
    body: (
      <>
        女の子みたいに可愛くなりたい！
        <br />
        そんな男の娘たちの気持ちを応援するために作られた仮想通貨です。
        <br />
        <br />
        "I want to be cute like a girl!"
        <br />
        This is a crypto currency created to support the feelings of such crossdressers.
      </>
    ),
  },
  {
    icon: IntersexIcon,
    title: '価値の創造 - Creation of value',
    body: (
      <>
        男の娘が社会貢献できるよう地位の向上を目指し、価値ある活動を行います。
        <br />
        <br />
        We will carry out valuable activities with the aim of improving our status so that
        crossdressers can contribute to society.
      </>
    ),
  },
  {
    icon: PinIcon,
    title: '情報の共有 - Information sharing',
    body: (
      <>
        男の娘としてより活動しやすくするためのノウハウを集積し、共有していきます。
        <br />
        <br />
        We will accumulate and share the know-how to make it easier to Activity as a crossdresser.
      </>
    ),
  },
]

function Services() {
  return (
    <section id="services" className="border-b border-line bg-section-alt py-20">
      <div className="mx-auto max-w-[1170px] px-4">
        <SectionHeader title="男の娘トークン (TRAP) とは" sub="What is Otokonoko Token (TRAP) ?" />
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} dir="up" delay={i * 140}>
              <div className="po-card group h-full px-9 py-10 text-center">
                <s.icon className="mx-auto mb-6 h-11 w-11 text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-125" />
                <h3 className="mb-4 text-[1.15rem] font-semibold text-accent">{s.title}</h3>
                <p className="font-light leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** SECTION: 仕様について */
const specs = [
  ['通貨名 - Token name', '男の娘トークン - Otokonoko Token'],
  ['シンボル - Symbol', 'TRAP'],
  ['種別 - Token type', 'VIPSTARCOIN TOKEN'],
  ['総発行枚数 - Total amount', '10,500 TRAP'],
  ['小数部桁数 - decimals', '18桁'],
  ['コントラクトアドレス - Contract address', '178421c92c8f8dc6466d6bb5e911958882f182b5'],
]

function About() {
  return (
    <section id="story" className="border-b border-line bg-white py-20">
      <div className="mx-auto max-w-[1170px] px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal dir="left">
            <h2 className="mb-5 text-[2rem] leading-tight text-heading sm:text-[2.4rem]">
              仕様について - About Details
            </h2>
            <span className="colored-line line-grow line-grow-left mb-8" />
            <ul className="space-y-5 font-light">
              {specs.map(([label, value], i) => (
                <Reveal key={label} as="li" dir="up" delay={200 + i * 90}>
                  <span className="block">{label}</span>
                  <span className="block break-all font-normal">{value}</span>
                </Reveal>
              ))}
            </ul>
          </Reveal>
          <Reveal dir="right" className="order-first md:order-none">
            <img
              src="/wp-content/uploads/2019/02/TRAP-1.png"
              alt="仕様について - About Details"
              className="animate-float mx-auto w-full max-w-[450px]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** SECTION: メンバー */
function Team() {
  return (
    <section id="team" className="border-b border-line bg-white pb-14 pt-20">
      <div className="mx-auto max-w-[1170px] px-4">
        <SectionHeader
          title="メンバー - members"
          sub="男の娘トークンのメンバーを紹介します - Introduce the members of the otokonoko token"
        />
        <div className="flex justify-center">
          <Reveal dir="zoom" className="w-full max-w-[270px]">
            <div className="po-card group relative overflow-hidden">
              <img
                src="/wp-content/uploads/2020/01/ゆきのスノウエルフたん統合-268x273.png"
                alt="ROZ"
                className="w-full transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* 旧テーマ .member-details: ホバーで画像上にスライド表示 */}
              <div className="absolute inset-0 flex -translate-y-full flex-col items-center justify-center bg-black/70 text-center opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <h5 className="mb-1 text-[1.1rem] font-semibold text-accent">ROZ</h5>
                <div className="mb-3 text-[0.85rem] text-white">管理者 - Founder</div>
                <a
                  href="https://twitter.com/ROZ_mofumofu_me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ROZ の Twitter"
                  className="text-white transition-all duration-300 hover:-translate-y-1 hover:text-accent"
                >
                  <TwitterIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** SECTION: トークン詳細 */
const tokenDetails = [
  {
    title: 'エアドロップ',
    sub: 'Air Drop',
    body: (
      <>
        男の娘トークン公式Discordや、公式Twitterなどでエアドロップを行います。
        <br />
        <br />
        Perform airdrops on the Otokonoko token official Discord, the official Twitter, etc.
      </>
    ),
  },
  {
    title: '配布割合',
    sub: 'Distribution ratio',
    body: (
      <>
        発行枚数の80%をエアドロップ、残り20%を運営開発およびコミュニティ形成に充てます。
        <br />
        <br />
        80% of the issue number will be airdrop, and the remaining 20% will be for operation
        development and community formation.
      </>
    ),
  },
  {
    title: 'ロードマップ',
    sub: 'Road map',
    body: (
      <>
        2018/8/22
        <br />
        トークン生成、エアドロップ開始
        <br />
        20XX
        <br />
        男の娘支援サイト設立
        <br />
        20XX
        <br />
        取引所に上場
        <br />
        <br />
        2018/8/22
        <br />
        Token generation, and air drop was start.
        <br />
        20XX
        <br />
        Established a support site for crossdresser
        <br />
        20XX
        <br />
        Listed on exchanges
      </>
    ),
  },
]

function TokenDetails() {
  return (
    <section id="customers" className="border-b border-line bg-white pb-16 pt-20 text-center">
      <div className="mx-auto max-w-[1170px] px-4">
        <SectionHeader title="トークン詳細" sub="Detail of token" />
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
          {tokenDetails.map((d, i) => (
            <Reveal key={d.title} dir="right" delay={i * 140} className="relative mt-10">
              <div className="po-card group h-full px-9 pb-10 pt-14">
                <h5 className="mb-1 text-[1.1rem] font-semibold text-accent">{d.title}</h5>
                <div className="mb-4 text-[0.85rem] text-fg-dim">{d.sub}</div>
                <p className="font-light leading-relaxed">{d.body}</p>
              </div>
              <img
                src="/wp-content/uploads/2019/02/TRAP-1-300x300.png"
                alt={d.title}
                className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border border-card-line bg-white shadow-md transition-transform duration-500 hover:rotate-[360deg]"
                loading="lazy"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** SECTION: コールトゥアクション（リボン） */
function Ribbon() {
  return (
    <section
      id="ribbon"
      className="border-b border-line bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${themeImg}/background-images/parallax-img/parallax-img1.jpg)`,
      }}
    >
      <div className="bg-[rgba(0,5,8,0.8)] px-4 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal dir="down">
            <h2 className="mb-10 text-[1.5rem] font-bold leading-relaxed text-white sm:text-[2rem]">
              VIPSTARCOINウォレットを導入して、男の娘トークンを始めましょう
              <br />
              Install a VIPSTARCOIN wallet and start the Otokonoko token
            </h2>
          </Reveal>
          <Reveal dir="up" delay={150}>
            <a
              href="http://1234asdf.webcrow.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="po-button"
            >
              始め方 - Getiing Started
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** SECTION: 最新情報 */
function LatestNews() {
  return (
    <section id="latestnews" className="border-b border-line bg-white py-20">
      <div className="mx-auto max-w-[1170px] px-4">
        <Reveal dir="left">
          <h2 className="mb-5 text-[2rem] leading-tight text-heading sm:text-[2.4rem]">
            最新情報 - News
          </h2>
          <span className="colored-line line-grow line-grow-left mb-10" />
        </Reveal>
        <ul className="border-l-2 border-card-line">
          {posts.map((p, i) => (
            <Reveal key={p.id} as="li" dir="left" delay={i * 120} className="py-4 pl-6 sm:pl-8">
              <div className="mb-3 text-[0.85rem] font-semibold text-fg-dim">
                {new Date(p.date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                {p.featuredImage && (
                  <Link to={p.path} className="group shrink-0 overflow-hidden">
                    <img
                      src="/wp-content/uploads/2019/02/TRAP-1-150x150.png"
                      alt=""
                      width="150"
                      height="150"
                      className="h-[110px] w-[110px] transition-transform duration-500 group-hover:scale-110 sm:h-[150px] sm:w-[150px]"
                      loading="lazy"
                    />
                  </Link>
                )}
                <div>
                  <h3 className="mb-1 text-[1.2rem] font-semibold leading-snug">
                    <Link to={p.path} className="text-heading transition-colors hover:text-accent">
                      {p.title}
                    </Link>
                  </h3>
                  <div className="mb-3 text-[0.82rem] text-fg-dim">
                    <time dateTime={p.date}>{p.dateDisplay.replace(/-0?/g, '/').slice(0, 10)}</time>
                    <span> by ROZ - mofumofu.me</span>
                  </div>
                  <p className="mb-2 font-light">{p.excerpt}</p>
                  <Link
                    to={p.path}
                    className="group inline-flex items-center gap-1 text-[0.9rem] text-accent"
                  >
                    <span className="group-hover:underline">Read more</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** SECTION: コンタクト */
const contactLinks = [
  { icon: MailIcon, label: 'Mail', href: 'mailto:mail@mofumofu.me' },
  { icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com/trap_token' },
  { icon: UsersIcon, label: 'Discord', href: 'https://discord.gg/XVTMffj' },
]

function ContactInfo() {
  return (
    <div id="contactinfo" className="bg-white pb-16 pt-10 text-center">
      <div className="mx-auto grid max-w-[1170px] gap-10 px-4 sm:grid-cols-3">
        {contactLinks.map((c, i) => (
          <Reveal key={c.label} dir="up" delay={i * 120}>
            <a
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group block"
            >
              <c.icon className="mx-auto mb-3 h-10 w-10 text-accent transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-110" />
              <span className="font-semibold text-heading transition-colors group-hover:text-accent">
                {c.label}
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function Home() {
  useMeta(SITE_TITLE, SITE_DESC)
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Team />
      <TokenDetails />
      <Ribbon />
      <LatestNews />
      <ContactInfo />
    </>
  )
}

/* ============================== 下層ページ ============================== */

export function NewsPost() {
  const { id } = useParams()
  const { pathname } = useLocation()

  // /news/:id/ からも、旧 WordPress の URL からも同じ記事に解決する。
  const post =
    posts.find((p) => String(p.id) === id) ??
    posts.find(
      (p) =>
        p.path === pathname ||
        p.path === `${pathname}/` ||
        `/${p.slug}/` === pathname ||
        `/${p.slug}` === pathname,
    )

  useMeta(
    post ? `${post.title} | ${SITE_TITLE}` : `記事が見つかりません | ${SITE_TITLE}`,
    post?.excerpt,
  )

  if (!post) return <NotFound />

  return (
    <Wrap>
      <PageTitle>{post.title}</PageTitle>
      <p className="mb-7 text-[0.85rem] text-fg-dim">{post.dateDisplay} by ROZ - mofumofu.me</p>
      {post.featuredImage && (
        <img src={post.featuredImage} alt="" className="mb-8 max-w-[300px]" loading="lazy" />
      )}
      <Prose html={post.html} />
      <div className="mt-11 border-t border-line pt-5">
        <Link to="/" className="text-[0.9rem] text-accent hover:underline">
          ← トップへ戻る
        </Link>
      </div>
    </Wrap>
  )
}

export function Privacy() {
  const page = pageBySlug('privacy')
  useMeta(`Privacy Policy | ${SITE_TITLE}`, page?.excerpt)
  if (!page) return <NotFound />
  return (
    <Wrap>
      <PageTitle>Privacy Policy</PageTitle>
      <Prose html={page.html} />
    </Wrap>
  )
}

export function Contact() {
  useMeta(`Contact Form | ${SITE_TITLE}`, '男の娘トークン (TRAP) へのお問い合わせ。')
  return (
    <Wrap>
      <PageTitle>Contact Form</PageTitle>
      <Lede>お問い合わせは以下からお願いいたします。</Lede>
      <div className="my-7 grid gap-4 sm:grid-cols-3">
        {contactLinks.map((c, i) => (
          <Reveal key={c.label} dir="up" delay={i * 100}>
            <a
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="po-card group block px-6 py-8 text-center"
            >
              <c.icon className="mx-auto mb-3 h-9 w-9 text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
              <span className="font-semibold text-heading transition-colors group-hover:text-accent">
                {c.label}
              </span>
            </a>
          </Reveal>
        ))}
      </div>
      <div className="my-6 border-l-[3px] border-accent bg-section-alt px-5 py-4 text-[0.9rem] text-fg-dim">
        <strong className="text-fg">メールフォームについて</strong>
        <br />
        サイトの構成変更にともない、旧お問い合わせフォームは一時停止しています。
      </div>
    </Wrap>
  )
}

export function NotFound() {
  useMeta(`ページが見つかりません | ${SITE_TITLE}`)
  return (
    <Wrap>
      <PageTitle>ページが見つかりません</PageTitle>
      <Lede>お探しのページは移動または削除された可能性があります。</Lede>
      <Link to="/" className="po-button">
        トップへ戻る
      </Link>
    </Wrap>
  )
}
