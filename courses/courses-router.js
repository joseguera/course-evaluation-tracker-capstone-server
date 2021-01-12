const path = require('path');
const express = require('express');
const xss = require('xss');
const CoursesService = require('./courses-service');
const { requireAuth } = require('../src/middleware/jwt-auth')

const coursesRouter = express.Router();
const jsonParser = express.json();

const serializeCourse = course => ({
    id: course.id,
    instructor_name: xss(course.instructor_name),
    program_area: xss(course.program_area),
    program_rep: course.program_rep,
    course_number: xss(course.course_number),
    course_name: xss(course.course_name),
    quarter: xss(course.quarter),
    project_id: course.project_id,
    notes: xss(course.notes),
    total: course.total
});

coursesRouter
    .route('/')
    .get((req, res, next) => {
        CoursesService.getAllCourses(
            req.app.get('db')
        )
            .then(courses => {
                res.json(courses.map(serializeCourse))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { instructor_name, course_number, course_name, 
                quarter, project_id, total } = req.body;
        const newCourse = { instructor_name, course_number, 
                            course_name, quarter,
                            project_id, total };
        
        for (const [key, value] of Object.entries(newCourse)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in the request body` }
                });
            }
        }

        newCourse.program_rep = req.user.id;
        
        CoursesService.insertCourse(
            req.app.get('db'),
            newCourse
        )
            .then(course => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${course.id}`))
                    .json(course)
            })
            .catch(next)
    });

coursesRouter
    .route('/:course_id')
    // .all(requireAuth)
    .all((req, res, next) => {
        CoursesService.getById(
            req.app.get('db'),
            req.params.course_id
        )
            .then(course => {
                if (!course) {
                    return res.status(404).json({
                        error: { message: `Course doesn't exist` }
                })
            }
            res.course = course
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCourse(res.course));
    })
    .delete((req, res, next) => {
        CoursesService.deleteCourse(
            req.app.get('db'),
            req.params.course_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const { instructor_name, course_number, course_name, 
                quarter, project_id, total } = req.body;
        const courseToUpdate = { instructor_name, course_number, 
                                course_name, quarter,
                                project_id, total  };

        const numberOfValues = Object.values(courseToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'instructor_name', 'course_number', 'course_name', 'quarter', 'project_id', 'total'`
                }
            })
        }

        courseToUpdate.program_rep = req.user.id;

        CoursesService.updateCourse(
            req.app.get('db'),
            req.params.course_id,
            courseToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = coursesRouter;