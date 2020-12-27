const {Router} = require('express');
// const config = require('config');
const config = require('../../config/default.json');
const Card = require('../../models/Card.js');
const User = require('../../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const router = Router();

router.get('/', async (req, res) => {
    const cards = await Card.find({}).lean();
    res.render('index', {
        title: "Flashcards",
        isIndexPage: true,
        cards
    });
})

router.get('/create', (req, res) => {
    res.render('create', {
        title: "Create cards",
        isCreatePage: true
    });
})

router.post('/create', async (req, res) => {
    const card = new Card({
        englishWord: req.body.enWord,
    });
    await card.save();
    res.redirect('/');
})

router.post(
    'api/auth/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля  6 символов').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                });
            }

            const {email, password} = req.body;

            // ожидаем результата поиска по email:
            // если такой email есть - то в регистрации будет отказано
            const candidate = await User.findOne({email: email});
            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует.'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email: email,
                password: hashedPassword
            });
            await user.save();
            res.status(201).json({message: 'Вы успешно зарегистрированы.'})

        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так...'});
        }
    }
)

router.post(
    'api/auth/login',
    [
        check('email', 'Неверные данные').normalizeEmail().isEmail(),
        check('password', 'Неверные данные').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные'
                });
            }

            const {email, password} = req.body;

            const user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({message: 'Пользователь не найден'});
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.jwtSecret,
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id});

        } catch (e) {
            res.status(500).json({message: 'что-то пошло не так...'});
        }
    }
)

module.exports = router;