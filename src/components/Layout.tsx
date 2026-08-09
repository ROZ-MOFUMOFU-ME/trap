import { Link, useLocation } from 'react-router'
import { useEffect, useState, type ReactNode } from 'react'

/** ページ遷移のたびにスクロール位置を先頭へ戻す。 */
function useScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}

/**
 * 旧テーマ（Parallax One）のスティッキーナビ。
 * トップページではヒーローを過ぎてから現れ、下層ページでは常時表示する。
 */
function StickyNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [shown, setShown] = useState(!isHome)

  useEffect(() => {
    if (!isHome) {
      setShown(true)
      return
    }
    const onScroll = () => setShown(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_8px_0_rgba(50,50,50,0.08)] transition-transform duration-300 ${
        shown ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex min-h-[70px] max-w-[1170px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
        <Link to="/" className="block leading-tight">
          <span className="block text-[1.35rem] font-semibold text-heading">
            Otokonoko Token (TRAP)
          </span>
          <span className="block text-[0.72rem] tracking-wide text-fg-dim">
            Cryptocurruncy for Crossdressers
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 text-[0.9rem]">
          <Link to="/contact/" className="nav-link py-2 text-fg transition-colors hover:text-accent">
            Contact Form
          </Link>
          <Link to="/privacy/" className="nav-link py-2 text-fg transition-colors hover:text-accent">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  useScrollReset()

  return (
    <div className="flex min-h-screen flex-col">
      <StickyNav />
      <main className="flex-1">{children}</main>

      {/* 旧テーマの .footer.grey-bg 相当 */}
      <footer className="border-t border-line bg-section-alt py-10 text-center text-[0.85rem]">
        <div className="mx-auto max-w-[1170px] px-4">
          <div className="mb-4 flex justify-center gap-6">
            <Link to="/contact/" className="text-fg-dim transition-colors hover:text-accent">
              Contact Form
            </Link>
            <Link to="/privacy/" className="text-fg-dim transition-colors hover:text-accent">
              Privacy Policy
            </Link>
          </div>
          <span className="text-fg-dim">©ROZ</span>
        </div>
      </footer>
    </div>
  )
}

/** 下層ページの本文コンテナ。固定ナビの高さぶん上を空け、入場アニメーションを掛ける。 */
export function Wrap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`page-in mx-auto max-w-3xl px-5 pb-16 pt-[110px] ${className}`}>{children}</div>
  )
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="mb-3 text-[1.9rem] font-semibold leading-[1.35] text-heading">{children}</h1>
      <span className="colored-line" />
    </div>
  )
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="mb-8 text-fg-dim">{children}</p>
}

/** WordPress 由来の HTML を描画する。 */
export function Prose({ html }: { html: string }) {
  return <div className="prose-wp" dangerouslySetInnerHTML={{ __html: html }} />
}
