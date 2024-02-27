const express = require('express')
const Users = require('../models/Users-model')
const auth = require('../middlewares/auth')
const routes = express.Router()
const {signupCounter, loginCounter} = require('./metrics')



// User create (signup)
routes.post('/signup', async (req, res) => {
    const newUser = req.body
    const fieldsToAdd = Object.keys(newUser)
    const fieldsInModel = ['name', 'email', 'password']
    const isAdditionAllowed = fieldsToAdd.every((field) => fieldsInModel.includes(field))

    if (!isAdditionAllowed) {
        return res.status(400).send({ error: 'Invalid fields to Add!' })
    }

    try {
        const user = await Users(newUser);
        await user.save();
        // console.log('User created successfully');
        try {
            signupCounter.inc(); // Increment the signup counter
            console.log('signupCounter incremented');
        } catch (error) {
            console.error('Error incrementing signupCounter:', error);
        }
        res.send({ user });
    } catch (e) {
        console.error(e); // Log the error to the console for debugging
        res.status(400).send(e);
    }
});

// check if previously loggeding
routes.post('/init', auth, async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
        };

        const { token, user } = req
        if (token && user) {
            res.cookie('todo-jt', req.token, cookieOptions).send({ user, token })
        }
    } catch (e) {
        console.error(e); // Log the error to the console for debugging
        res.status(400).send(e)
    }
})

// Login user
routes.post('/login', async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
        };

        const user = await Users.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()

        loginCounter.inc(); // Increment the login counter
        res.cookie('todo-jt', token, cookieOptions).send({ user, token })

    } catch (e) {
        console.error(e); // Log the error to the console for debugging
        res.status(400).send({ error: e.message }); // Send the error message back to the client for more insight
    }
})

//logout user
routes.post('/logout', auth, async (req, res) => {
    try {
        const { user, token } = req

        user.tokens = user.tokens.filter((t) => t.token !== token)
        await user.save()

        res.clearCookie('todo-jt')

        res.send()
    } catch (e) {
        console.error(e); // Log the error to the console for debugging
        res.status(400).send({ error: e.message });
    }
})

module.exports = routes