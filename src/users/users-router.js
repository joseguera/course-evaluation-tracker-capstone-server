const express = require('express')
const path = require('path')
const xss = require('xss');
const UsersService = require('./users-service')


const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
        id: user.id,
        first_name: xss(user.first_name),
        last_name: xss(user.last_name),
        username: xss(user.username),
})

usersRouter
    .route('/')
    .get((req, res, next) => {

        UsersService.getAllUsers(
            req.app.get('db')
        )
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const {  first_name, last_name, username, password } = req.body

        for (const field of ['first_name', 'last_name', 'username', 'password'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        const passwordError = UsersService.validatePassword(password);

        if (passwordError)
            return res.status(400).json({ error: passwordError });

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUserName => {
                if (hasUserWithUserName)
                    return res.status(400).json({ error: `Username already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            first_name,
                            last_name,
                            username,
                            password: hashedPassword
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User doesn't exist` }
                    })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeUser(res.user));
    })

module.exports = usersRouter