const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);