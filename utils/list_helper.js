const dummy = (blogs) => { // eslint-disable-line no-unused-vars
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

const mostBlogs = (blogList) => {
  const blogCountMap = new Map()
  blogList.forEach(({ author }) => {
    if (!blogCountMap.has(author)) {
      blogCountMap.set(author, 1)
    } else {
      blogCountMap.set(author, blogCountMap.get(author) + 1)
    }
  })

  let bestEntry = null
  for (const [author, blogs] of blogCountMap.entries()) {
    if (bestEntry === null || blogs > bestEntry.blogs) {
      bestEntry = { author, blogs }
    }
  }

  return bestEntry
}

const mostLikes = (blogList) => {
  const authorLikesMap = new Map()
  blogList.forEach(({ author, likes }) => {
    if (!authorLikesMap.has(author)) {
      authorLikesMap.set(author, likes)
    } else {
      authorLikesMap.set(author, authorLikesMap.get(author) + likes)
    }
  })

  let bestEntry = null
  for (const [author, likes] of authorLikesMap.entries()) {
    if (bestEntry === null || likes > bestEntry.likes) {
      bestEntry = { author, likes }
    }
  }

  return bestEntry
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
