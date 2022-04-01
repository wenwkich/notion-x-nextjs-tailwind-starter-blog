import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { NotionLayoutRenderer } from '@/components/NotionComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/notion'
import { getFileBySlug as getFileBySlugMdx } from '@/lib/mdx'
import { useTheme } from 'next-themes'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('blog')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('blog', params.slug.join('/'))
  const authorList = post.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlugMdx('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // // rss
  // if (allPosts.length > 0) {
  //   const rss = generateRss(allPosts)
  //   fs.writeFileSync('./public/feed.xml', rss)
  // }

  return { props: { post, authorDetails, prev, next } }
}

export default function Blog({ post, authorDetails, prev, next }) {
  const { recordMap, frontMatter } = post
  const { theme, resolvedTheme } = useTheme()

  return (
    <>
      {frontMatter.draft !== true ? (
        <NotionLayoutRenderer
          layout={DEFAULT_LAYOUT}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          recordMap={recordMap}
          darkMode={theme === 'dark' || resolvedTheme === 'dark'}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
