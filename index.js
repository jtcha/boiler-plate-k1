const express = require('express')
const app = express();
const port = 5000;

const { User } = require('./models/User')
const bodyParser = require('body-parser')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true}))

const mongoose = require('mongoose')
mongoose.connect(config.mongodbURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongodb connected...'))
  .catch(err => console.log(err))

app.post('/register', (req, res) => {
    // 회원가입시 필요한 정보를 클라이언트에서 가져오면 데이터베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })

})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app lstening on port ${port}!`)) 
