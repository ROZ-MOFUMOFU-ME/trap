import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { Home, NewsPost, Contact, Privacy, NotFound } from './routes/Pages'
import content from './content/site.json'
import type { SiteContent } from './content/types'

const site = content as SiteContent

/** 旧 WordPress の記事 URL（日本語カテゴリを含むパスと /:slug/）も拾えるようにする。 */
const legacyPostPaths = [
  ...site.posts.map((p) => p.path),
  ...site.posts.map((p) => `/${p.slug}/`),
]

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news/:id/" element={<NewsPost />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/privacy/" element={<Privacy />} />
          {/* 旧 URL からの流入を維持する */}
          {legacyPostPaths.map((path) => (
            <Route key={path} path={path} element={<NewsPost />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
