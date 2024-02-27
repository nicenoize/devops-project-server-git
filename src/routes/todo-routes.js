const express = require('express')
const ToDos = require('../models/Todos-model')
const auth = require('../middlewares/auth')
const routes = express.Router()
const {todosCreatedCounter, todosCompletedCounter, todosUpdatedCounter, todosDeletedCounter} = require('./metrics')

routes.post('/todo/add', auth, async (req, res) => {
    const newTodo = req.body

    const fieldsToAdd = Object.keys(newTodo)
    const fieldsInModel = ['title', 'description']
    const isAdditionAllowed = fieldsToAdd.every((field) => fieldsInModel.includes(field))

    if (!isAdditionAllowed) {
        return res.status(400).send({ error: 'Invalid fields to Add!' })
    }

    try {
        const todo = await ToDos({
            ...newTodo,
            user: req.user._id,
        })

        await todo.save()

    todosCreatedCounter.inc();
    res.send({ todo })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

routes.post('/todo/list', auth, async (req, res) => {
    try {

        const todos = await ToDos.find({
            user: req.user._id
        })
        
        res.send(todos)
    }
    catch (e) {
        res.status(500).send
    }
})

routes.patch('/todo/update', auth, async (req, res) => {
    const changedTodo = req.body
    const fieldsToUpdate = Object.keys(changedTodo)
    const fieldsInModel = ['_id', 'important', 'done']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))

    if (!isUpdateAllowed) {
        return res.status(400).send({ error: 'Invalid fields to update!' })
    }
    const updateObj = {}
    if (changedTodo.hasOwnProperty("important")) {
        updateObj.important = changedTodo.important
    }

    if (changedTodo.hasOwnProperty("done")) {
        todosCompletedCounter.inc()
        updateObj.done = changedTodo.done
    }

    try {
        const todo = await ToDos.findByIdAndUpdate({
            _id: changedTodo._id,
            user: req.user._id,
        },
            updateObj,
            { new: true, runValidators: true })

        if (!todo) { return res.status(404).send() }

        todosUpdatedCounter.inc();
        res.send(todo)

    } catch (e) {
        res.status(400).send(e)
    }
})

routes.delete('/todo/delete', auth, async (req, res) => {
    try {
        const todo = await ToDos.findById(req.body._id)

        await todo.remove()
        res.send(todo)

        todosDeletedCounter.inc();

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = routes

