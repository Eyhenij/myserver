const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cards: [{type: Types.ObjectId, ref: 'Card' }]
});

module.exports = model('User', schema);