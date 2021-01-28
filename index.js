const express = require('express')
const app = express();
const port = 5000;

const { User } = require('./models/User')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')
const { auth } = require('./middleware/auth')


app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

const mongoose = require('mongoose')
mongoose.connect(config.mongodbURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongodb connected...'))
  .catch(err => console.log(err))



app.post('/api/users/register', (req, res) => {
    // 회원가입시 필요한 정보를 클라이언트에서 가져오면 데이터베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })

})

app.post('/api/users/login', (req, res) => {

    // 요청한 이메일을 데이터베이스에서 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                logiinSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            })
        }

        // 요청한 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({ logiinSuccess: false, message: "비밀번호가 일치하지 않습니다." })
            
            // 비밀번호가 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)

                // 토큰을 저장한다.
                res.cookie('x_auth', user.token)
                .status(200)
                .json({logiinSuccess: true, userId: user._id})
            })
        
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지오면 auth가 true라는 뜻.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""},
    (err, user) => {
        if(err) return res.json({success: false, err})
        return res.status(200).send({
            success: true
        })
    })
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app lstening on port ${port}!`)) 
