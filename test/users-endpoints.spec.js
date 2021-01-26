const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeCoursesFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['first_name', 'last_name', 'username', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: 'test password',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: '1234567',
        }
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` })
      })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: '*'.repeat(73),
        }
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` })
      })

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: ' 1Aa!2Bb@',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: '1Aa!2Bb@ ',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: '11AAaabb',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
      })

      it(`responds 400 'User name already taken' when username isn't unique`, () => {
        const duplicateUser = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: testUser.username,
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          username: 'test username',
          password: '11AAaa!!',
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            const user = res.body;
            // console.log(user);
              expect(user).to.have.property('id')
              expect(user.first_name).to.eql(newUser.first_name)
              expect(user.last_name).to.eql(newUser.last_name)
              expect(user.username).to.eql(newUser.username)
              expect(user).to.not.have.property('password')
              expect(res.headers.location).to.eql(`/api/users/${user.id}`)
          })
          .expect(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.first_name).to.eql(newUser.first_name)
                expect(row.last_name).to.eql(newUser.last_name)
                expect(row.username).to.eql(newUser.username)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })
})
