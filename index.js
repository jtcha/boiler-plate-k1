const express = require('express')
const app = express();
const port = 5000;

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://cielr47:@cluster0.riqxf.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongodb connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Example app lstening on port ${port}!`))
