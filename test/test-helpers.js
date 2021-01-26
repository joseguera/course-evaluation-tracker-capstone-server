const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: 'Test 1',
      last_name: 'User 1',
      username: 'test-user-1',
      password: 'password',
    },
    {
      id: 2,
      first_name: 'Test 2',
      last_name: 'User 2',
      username: 'test-user-2',
      password: 'password',
    },
    {
      id: 3,
      first_name: 'Test 3',
      last_name: 'User 3',
      username: 'test-user-3',
      password: 'password',
    },
    {
      id: 4,
      first_name: 'Test 4',
      last_name: 'User 4',
      username: 'test-user-4',
      password: 'password',
    },
  ]
}

function makeCoursesArray(users) {
  return [
    {
        id: 1,
        instructor_name: "Test 1",
        program_area: "LMC",
        course_number: "MGMT X 567.8",
        course_name: "Mo' Money, Mo' Problems",
        quarter: "Winter 2021",
        project_id: "377656",
        notes: "missing nothing",
        q1: 2,
        q2: 2,
        q3: 2,
        q4: 2,
        q5: 2,
        q6: 2,
        q7: 2,
        q8: 2,
        q9: 2,
        q10: 2
    },
    {
        id: 2,
        instructor_name: "Test 1",
        program_area: "LMC",
        course_number: "MGMT X 567.8",
        course_name: "Mo' Money, Mo' Problems",
        quarter: "Winter 2021",
        project_id: "377656",
        notes: "missing nothing",
        q1: 2,
        q2: 2,
        q3: 2,
        q4: 2,
        q5: 2,
        q6: 2,
        q7: 2,
        q8: 2,
        q9: 2,
        q10: 2
    },
    {
        id: 3,
        instructor_name: "Test 1",
        program_area: "LMC",
        course_number: "MGMT X 567.8",
        course_name: "Mo' Money, Mo' Problems",
        quarter: "Winter 2021",
        project_id: "377656",
        notes: "missing nothing",
        q1: 2,
        q2: 2,
        q3: 2,
        q4: 2,
        q5: 2,
        q6: 2,
        q7: 2,
        q8: 2,
        q9: 2,
        q10: 2
    },
    {
        id: 4,
        instructor_name: "Test 1",
        program_area: "LMC",
        course_number: "MGMT X 567.8",
        course_name: "Mo' Money, Mo' Problems",
        quarter: "Winter 2021",
        project_id: "377656",
        notes: "missing nothing",
        q1: 2,
        q2: 2,
        q3: 2,
        q4: 2,
        q5: 2,
        q6: 2,
        q7: 2,
        q8: 2,
        q9: 2,
        q10: 2
    },
    
  ]
}

function makeExpectedCourse(course) {

  return {
        id: course.id,
        instructor_name: course.instructor_name,
        program_area: course.program_area,
        course_number: course.course_number,
        course_name: course.course_name,
        quarter: course.quarter,
        project_id: course.project_id,
        notes: course.notes,
        q1: course.q1,
        q2: course.q2,
        q3: course.q3,
        q4: course.q4,
        q5: course.q5,
        q6: course.q6,
        q7: course.q7,
        q8: course.q8,
        q9: course.q9,
        q10: course.q10
  }
}

function makeMaliciousArticle(user) {
  const maliciousArticle = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedArticle = {
    ...makeExpectedCourse([user], maliciousArticle),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousArticle,
    expectedArticle,
  }
}

function makeArticlesFixtures() {
  const testUsers = makeUsersArray()
  const testCourses = makeCoursesArray(testUsers)
  return { testUsers, testCourses }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        courses,
        users,
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE courses_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('courses_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('blogful_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('blogful_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedArticlesTables(db, users, articles) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('blogful_articles').insert(articles)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('blogful_articles_id_seq', ?)`,
      [articles[articles.length - 1].id],
    )
  })
}

function seedMaliciousArticle(db, user, article) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('blogful_articles')
        .insert([article])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeCoursesArray,
  makeExpectedCourse,
  makeMaliciousArticle,

  makeArticlesFixtures,
  cleanTables,
  seedArticlesTables,
  seedMaliciousArticle,
  makeAuthHeader,
  seedUsers,
}
