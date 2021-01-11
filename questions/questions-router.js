const path = require('path');
const express = require('express');
const xss = require('xss');
const QuestionsService = require('./questions-service');
const { requireAuth } = require('../src/middleware/jwt-auth')

const questionsRouter = express.Router();
const jsonParser = express.json();

const serializeQuestion = question => ({
    id: question.id,
    q1: question.q1,
    q2: question.q2,
    q3: question.q3,
    q4: question.q4,
    q5: question.q5,
    q6: question.q6,
    q7: question.q7,
    q8: question.q8,
    q9: question.q9,
    q10: question.q10,
});

questionsRouter
    .route('/')
    .get((req, res, next) => {
        QuestionsService.getAllQuestions(
            req.app.get('db')
        )
            .then(questions => {
                res.json(questions.map(serializeQuestion))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
        const newQuestion = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 };
        
        for (const [key, value] of Object.entries(newQuestion)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in the request body` }
                });
            }
        }
        
        QuestionsService.insertQuestion(
            req.app.get('db'),
            newQuestion
        )
            .then(question => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${question.id}`))
                    .json(question)
            })
            .catch(next)
    });

questionsRouter
    .route('/:question_id')
    .all(requireAuth)
    .all((req, res, next) => {
        QuestionsService.getById(
            req.app.get('db'),
            req.params.question_id
        )
            .then(question => {
                if (!question) {
                    return res.status(404).json({
                        error: { message: `Question doesn't exist` }
                })
            }
            res.question = question
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeQuestion(res.question));
    })
    .delete((req, res, next) => {
        QuestionsService.deleteQuestion(
            req.app.get('db'),
            req.params.question_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;
        const questionToUpdate = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 };

        const numberOfValues = Object.values(questionToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'questions'`
                }
            })
        }

        questionToUpdate.program_rep = req.user.id;

        QuestionsService.updateQuestion(
            req.app.get('db'),
            req.params.question_id,
            questionToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = questionsRouter;