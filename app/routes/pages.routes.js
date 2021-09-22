module.exports = (app) => {
    const Note = require('../models/note.model.js');
    const axios = require('axios');
    require('./notes.routes.js')(app)

    // Load Index Page
    app.get('/', (req, res) => {
        Note.find()
        .then((resp) => {
            res.render('index.ejs', { notes : resp })
        })
        .catch((error) => {
            console.log(error)
        })
    })

    app.get('/index', (req, res) => {
        res.redirect('/');
    })
}