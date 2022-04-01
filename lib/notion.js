import fs from 'fs'
import path from 'path'
import getAllFilesRecursively from './utils/files'

const root = process.cwd()

export function getFiles(type) {
  const prefixPaths = path.join(root, 'data', type)
  const files = getAllFilesRecursively(prefixPaths)
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}

export function formatSlug(slug) {
  return slug.replace(/\.json/, '')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export const pageToPostTransformer = (page) => {
  return {
    id: page.id,
    title: page.properties.Title.title[0].plain_text,
    tags: page.properties.Tags.multi_select.map((tag) => tag.name),
    date: page.properties.Updated.last_edited_time,
    slug: page.properties.Slug.formula.string,
  }
}

export async function getFileBySlug(type, slug) {
  const jsonPath = path.join(root, 'data', type, `${slug}.json`)
  const source = fs.readFileSync(jsonPath, 'utf8')
  const page = JSON.parse(source)
  const { recordMap } = page
  const frontmatter = pageToPostTransformer(page)
  return {
    recordMap,
    frontMatter: {
      slug: slug || null,
      fileName: `${slug}.json`,
      frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  }
}

export async function getAllFilesFrontMatter(folder) {
  const prefixPaths = path.join(root, 'data', folder)

  const files = getAllFilesRecursively(prefixPaths)

  const allFrontMatter = []

  files.forEach((file) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    // Remove Unexpected File
    if (path.extname(fileName) !== '.json') {
      return
    }
    const source = fs.readFileSync(file, 'utf8')
    const page = JSON.parse(source)
    const frontmatter = pageToPostTransformer(page)
    allFrontMatter.push(frontmatter)
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
