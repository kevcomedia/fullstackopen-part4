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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
