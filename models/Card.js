const {Schema, model} = require('mongoose');

const schema = new Schema({
    englishWord: {
        // value: 'some word',
        type: String,
        required: true
    },
    // russianWord: {
    //     type: String,
    //     required: true
    // }
});

module.exports = model('Card', schema);