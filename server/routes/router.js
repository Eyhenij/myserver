const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: "Fleshcards",
        isIndexPage: true
    });
})

router.get('/create', (req, res) => {
    res.render('create', {
        title: "Create cards",
        isCreatePage: true
    });
})

module.exports = router;