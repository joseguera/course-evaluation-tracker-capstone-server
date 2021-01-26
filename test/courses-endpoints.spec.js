const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Courses Endpoints', function() {
  let db

  const {
    testUsers,
    testCourses
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

  describe(`GET /api/courses`, () => {
    context(`Given no courses`, () => {
      beforeEach(() =>
      helpers.seedUsers(db, testUsers)
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/courses')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are courses in the database', () => {
      beforeEach('insert courses', () =>
        helpers.seedCoursesTables(
          db,
          testUsers,
          testCourses
        )
      )

      it('responds with 200 and all of the courses', () => {
        const expectedCourses = testCourses.map(course =>
          helpers.makeExpectedCourse(
            course
          )
        )
        return supertest(app)
          .get('/api/courses')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedCourses)
      })
    })

    context(`Given an XSS attack course`, () => {
      const testUser = helpers.makeUsersArray()[0]
      const {
        maliciousCourse,
        expectedCourse,
      } = helpers.makeMaliciousCourse(testUser)

      beforeEach('insert malicious course', () => {
        return helpers.seedMaliciousCourse(
          db,
          testUser,
          maliciousCourse,
        )
      })
      // beforeEach('seeding users', () =>
      //   helpers.seedUsers(db, testUsers)
      // )
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/courses`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedCourse.title)
            expect(res.body[0].content).to.eql(expectedCourse.content)
          })
      })
    })
  })

  describe(`GET /api/courses/:course_id`, () => {
    context(`Given no courses`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const courseId = 123456
        return supertest(app)
          .get(`/api/courses/${courseId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error:  { message: "Course doesn't exist" }  })
      })
    })

    context('Given there are courses in the database', () => {
      beforeEach('insert courses', () =>
        helpers.seedCoursesTables(
          db,
          testUsers,
          testCourses,
        )
      )

      it('responds with 200 and the specified course', () => {
        const courseId = 2
        const expectedCourse = helpers.makeExpectedCourse(
          testCourses[courseId - 1],
        )
        db.select('*').from('courses').then(console.log)

        return supertest(app)
          .get(`/api/courses/${courseId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedCourse)
      })
    })

    context(`Given an XSS attack course`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousCourse,
        expectedCourse,
      } = helpers.makeMaliciousCourse(testUser)

      beforeEach('insert malicious course', () => {
        return helpers.seedMaliciousCourse(
          db,
          testUser,
          maliciousCourse,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/courses/${maliciousCourse.id}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedCourse.title)
            expect(res.body.content).to.eql(expectedCourse.content)
          })
      })
    })
  })
})
