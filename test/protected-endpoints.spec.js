const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
  let db

  const {
    testUsers,
    testCourses,
  } = helpers.makeCoursesFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  beforeEach('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert courses', () =>
    helpers.seedCoursesTables(
      db,
      testUsers,
      testCourses,
    )
  )

  const protectedEndpoints = [
    {
      name: 'GET /api/courses',
      path: '/api/courses',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/courses/:course_id',
      path: '/api/courses/1',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/courses',
      path: '/api/courses',
      method: supertest(app).post,
    },
  ]

  describe('endpoint test', () => {
    it(`responds 401 'Missing bearer token' when no bearer token`, () => {
      return supertest(app).get('/api/courses')
        .expect(401, { error: `Missing bearer token` })
    })
  })

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { username: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})
