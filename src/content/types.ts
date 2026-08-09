/** WordPress から書き出したコンテンツの型。content/*.json と対応する。 */

export type Entry = {
  id: number
  title: string
  slug: string
  /** ISO8601 */
  date: string
  /** YYYY-MM-DD */
  dateDisplay: string
  excerpt: string
  /** 本文（サニタイズ済みの HTML） */
  html: string
  /** 元サイトと同じ URL パス。既存リンクを壊さないために保持する。 */
  path: string
  categories: string[]
  tags: string[]
  featuredImage: string | null
}

export type Work = {
  id: number
  title: string
  slug: string
  date: string
  dateDisplay: string
  html: string
  path: string
  featuredImage: string | null
  thumb: string | null
}

export type SiteContent = {
  site: {
    name: string
    description: string
    host: string
  }
  posts: Entry[]
  pages: Entry[]
  works: Work[]
}
