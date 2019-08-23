const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likes, blog) => likes + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    if (favorite === null || blog.likes > favorite.likes) {
      return blog
    } else {
      return favorite
    }
  }, null)
}

const mostBlogs = (blogs) => {
  const counts = new Map()
  blogs.forEach(({ author }) => {
    if (!counts.has(author)) {
      counts.set(author, 1)
    } else {
      counts.set(author, counts.get(author) + 1)
    }
  })

  let bestEntry = null
  for (const entry of counts.entries()) {
    if (bestEntry === null || entry[1] > bestEntry.blogs) {
      bestEntry = {
        author: entry[0],
        blogs: entry[1],
      }
    }
  }

  return bestEntry
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
