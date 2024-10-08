const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})
describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
  
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
  
    const listWithManyBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Blog 1',
        author: 'Author 1',
        url: 'http://example.com/blog1',
        likes: 7,
        __v: 0
      },
      {
        _id: '5a422ba71b54a676234d17f9',
        title: 'Blog 2',
        author: 'Author 2',
        url: 'http://example.com/blog2',
        likes: 3,
        __v: 0
      }
    ]
  
    test('total likes of multiple blogs', () => {
      const result = listHelper.totalLikes(listWithManyBlogs)
      assert.strictEqual(result, 10)
    })
  })
  describe('favorite blog', () => {
    const listWithManyBlogs = [
      {
        title: 'Blog 1',
        author: 'Author 1',
        likes: 7
      },
      {
        title: 'Blog 2',
        author: 'Author 2',
        likes: 3
      },
      {
        title: 'Blog 3',
        author: 'Author 3',
        likes: 12
      }
    ]
  
    test('blog with most likes', () => {
      const result = listHelper.favoriteBlog(listWithManyBlogs)
      assert.deepStrictEqual(result, {
        title: 'Blog 3',
        author: 'Author 3',
        likes: 12
      })
    })
  })
  describe('most blogs', () => {
    const blogs = [
      { author: 'Author 1', title: 'Blog 1' },
      { author: 'Author 2', title: 'Blog 2' },
      { author: 'Author 1', title: 'Blog 3' },
      { author: 'Author 2', title: 'Blog 4' },
      { author: 'Author 1', title: 'Blog 5' }
    ]
  
    test('author with most blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, { author: 'Author 1', blogs: 3 })
    })
  })
  describe('most likes', () => {
    const blogs = [
      { author: 'Author 1', likes: 10 },
      { author: 'Author 2', likes: 3 },
      { author: 'Author 1', likes: 7 },
      { author: 'Author 3', likes: 12 }
    ]
  
    test('author with most likes', () => {
      const result = listHelper.mostLikes(blogs)
      assert.deepStrictEqual(result, { author: 'Author 1', likes: 17 })
    })
  })