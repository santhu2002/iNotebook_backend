const express = require('express');
const router = express.Router();
const Note = require('../models/Notes');
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');
const req = require('express/lib/request');
const res = require('express/lib/response');



// Route 1: Get all user Notes GET: "/api/notes/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured")
    }
})

// Route 2: Adding a new note  post: "/api/notes/addingnote" login required
router.post('/addingnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'enter description atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        //if there are any errors ,return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save();

        res.json(savednote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured")

    }
})

// Route 3: updating the existing note  Put: "/api/notes/updatenote/:id" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        //create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("not allowed to change")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured")

    }

})


// Route 4: deleting the existing note  Delete: "/api/notes/deletenote/:id" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found")
        }
        //Allow deletion if user owns that Note
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("not allowed to change")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured")

    }
})

module.exports = router