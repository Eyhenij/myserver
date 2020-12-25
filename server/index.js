const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const router = require('./routes/router.js');

const PORT = process.env.PORT || 3000;
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// создаём движок для рендеринга страницы
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(router);

async function start() {
    try {
        await mongoose.connect('mongodb+srv://admin:E8jSscR4uHq8WL3@cluster0.2vimx.mongodb.net/fleshcards', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e);
    }
}

start();

