# Course Evaluation Tracker Capstone - Server

## CourseGrader App
This app allows users to review courses and keep track of the instructor's syllabus and course quality as well as instructor-student interaction.



### 1. Working Prototype
You can access a working prototype of the React app here: https://course-evaluation-tracker-capstone.vercel.app/ and Node app here: https://secure-springs-04088.herokuapp.com/



### 2. User Stories
This app is for two types of users: a data entry user and a manager "admin" user

###### Landing
* As a visitor
 - I want to understand what I can do with this app (or sign up, or log in) so I can log in or create an account

###### Login Page
* As a returning register user
* I want to enter my password and username to use this app, so I can have access to the courses assigned to me

###### Sign Up/Registration Page
* As a visitor
* I want to register to use this app so I can create a work account.

###### Home Page
1. As a logged-in user,
* I want to be able to...
* view only my courses on the dashboard page of the app, so I can decide if I want to... 
*   evaluate a course, 
*   edit/complete my evaluation of a course I've started
*   create a new course that's missing from my list of courses
*   generate a report of my courses' scores

2. As an "admin" user,
* I want to be able to...
*   view all of the courses assigned to the data entry users



### 3. Functionality
The app's functionality includes:
* Every User has the ability to create an account
* Every User has the ability to "Add" a course
* Every User has the ability to "Edit" a course
* Every User has the ability to "Delete" a course



### 4. Technology
* Front-End: HTML5, CSS3, JavaScript ES6, React
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, PostgreSQL 
* Development Environment: Vercel, Heroku, DBeaver



### 5. Wireframes
Landing/Home Page
:-------------------------:
![Landing/Home Page](/github-images/wireframes/landing-page.png)
Login Page
![Login Page](/github-images/wireframes/login-page.png)
Dashboard Page
![Dashboard](/github-images/wireframes/dashboard.png)
Grading Form Page
![Grading Form](/github-images/wireframes/grading-form.png)

#### Graybox Wireframes
Landing/Home Page
:-------------------------:
![Landing/Home Page](/github-images/graybox-wireframes/landing-page.png)
Login Page
![Login Page](/github-images/graybox-wireframes/login-page.png)
Dashboard Page
![Dashboard](/github-images/graybox-wireframes/dashboard.png)
Grading Form Page
![Grading Form](/github-images/graybox-wireframes/grading-form.png)



### 6. Front-end Structure - React Components Map
* __Index.js__ (stateless)
    * __App.js__ (stateful)
        * __Header.js__ (stateless)
            * __LoginPage.js__ (stateless) -
                * __LoginForm.js__ (stateful) - gets the _"error"_ from the __App.js__
            * __RegistrationPage.js__ (stateless) -
                * __RegistrationForm.js__ (stateful) - gets the _"error"_ from the __App.js__
        * __Navigation.js__ (stateless)
            * __Home.js__ (stateless)
                * __NotFoundPage.js__ (stateless)
                * __AddCourse.js__ (stateful) - gets the _"error"_ from the __App.js__
                * __CourseList.js__ (stateful) gets the _"courses"_ from the __App.js__
                    * __CoursePage.js__ (stateful) context consumer from __App.js__
                    * __CourseItem.js__ (stateful) - context consumer from __App.js__
                        * __EditCourse.js__ (stateful) - context consumer from __App.js__



### 7. Back-end Structure - Business Objects
* users (database table)
    * id (auto-generated)
    * first_name (user-generated)
    * last_name (user-generated)
    * username (user-generated)
    * password (at least one number, one lowercase and one uppercase letter at least eight characters that are letters, numbers or the underscore)

* courses (database table)
    * id (auto-generated)
    * instructor_name (user-generated)
    * program_area (user-generated)
    * program_rep (foreign key - users id)
    * course_number (user-generated)
    * course_name (user-generated)
    * quarter (user-generated)
    * project_id (user-generated)
    * q1 (user-generated)
    * q2 (user-generated)
    * q3 (user-generated)
    * q4 (user-generated)
    * q5 (user-generated)
    * q6 (user-generated)
    * q7 (user-generated)
    * q8 (user-generated)
    * q9 (user-generated)
    * q10 (user-generated)
     
     

### 8. API Documentation (to do later)
API Documentation details:
* GET All Courses
    * `https://secure-springs-04088.herokuapp.com/api/courses`

* GET One Course
    * `https://secure-springs-04088.herokuapp.com/api/courses/12`

* POST Grade a Course
    * `https://secure-springs-04088.herokuapp.com/api/courses/`
        * JSON body
        *   {   
                "instructor_name": "Carl Johnson", "program_area": "LMC", "course_number": "MGMT X 567.8",
                "course_name": "Mo' Money, Mo' Problems", "quarter": "Winter 2021", "project_id": "377656",
                "notes": "missing nothing", "q1": 2, "q2": 2, "q3": 2, "q4": 2, "q5": 2, "q6": 2, "q7": 2,
                "q8": 2, "q9": 2, "q10": 2
            }

* POST Register User
    * `https://secure-springs-04088.herokuapp.com/api/users`
        * JSON body
        *   { "first_name": "Hello", "last_name": "Day", "username": "hello-day", "password": "Pass0809!" }

* PATCH Edit a Course
    * `https://secure-springs-04088.herokuapp.com/api/courses/12`
        * JSON body
        *   {   
                "instructor_name": "Carl Johnson", "program_area": "LMC", "course_number": "MGMT X 567.8",
                "course_name": "Mo' Money, Mo' Problems", "quarter": "Winter 2021", "project_id": "377656",
                "notes": "missing nothing", "q1": 2, "q2": 2, "q3": 2, "q4": 2, "q5": 2, "q6": 2, "q7": 2,
                "q8": 2, "q9": 2, "q10": 2
            }

* DELETE One Course
    * `https://secure-springs-04088.herokuapp.com/api/courses/12`



### 9. Screenshots
Landing/Home Page
:-------------------------:
![Landing/Home Page](/github-images/screenshots/landing page.png)
Login Page
![Login Page](/github-images/screenshots/login-page.png)
Dashboard Page
![Dashboard](/github-images/screenshots/dashboard.png)
Grading Form Page
![Grading Form](/github-images/screenshots/grading-form.png)



### 10. Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* Display a visual question total on the Dashboard's course tiles 
* Only display course created by a specific user
* Date when "course" was first created and last updated
* Sort/Filter Course:
  * By Quarter
  * By "project_id"
  * By date
* Ability to export a report of courses into a PDF or printer  



### 11. How to run it
Use command line to navigate into the project folder and run the following in terminal

##### Local React scripts
* To install the react project ===> npm install
* To run react (on port 3000) ===> npm start
* To run tests ===> npm run test

##### Local Node scripts
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test