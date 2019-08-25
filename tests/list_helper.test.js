const listHelper = require('../utils/list_helper')
const testHelper = require('../tests/test_helper.js')

const { listWithOneBlog, listWithManyBlogs } = testHelper

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated correctly', () => {
    expect(listHelper.totalLikes(listWithManyBlogs)).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    expect(listHelper.favoriteBlog([])).toEqual(null)
  })

  test('of list with one blog to be that blog itself', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url:
        'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    })
  })

  test('of a bigger list to be the first blog with most likes', () => {
    expect(listHelper.favoriteBlog(listWithManyBlogs)).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    })
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostBlogs([])).toEqual(null)
  })

  test('of list with one blog is object with its author and count of one', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })

  test('a bigger list is computed correctly', () => {
    expect(listHelper.mostBlogs(listWithManyBlogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostLikes([])).toEqual(null)
  })

  test('of list with one blog is object with its author and its likes', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('a bigger list is computed correctly', () => {
    expect(listHelper.mostLikes(listWithManyBlogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
