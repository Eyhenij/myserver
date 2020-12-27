const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const router = require('./routes/router.js');
const config = require('../config/default.json');
const path = require('path');

const PORT = process.env.PORT || config.port || 3000;
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// создаём движок для рендеринга страницы
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public'))); // указываем какую папку используем в качестве статической
app.use(express.urlencoded({extended: true}));
app.use(router);
// app.use('/api/auth', router); // разобраться и зарефакторить

async function start() {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}`)
        })
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}

start();

