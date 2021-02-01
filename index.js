const express = require('express') 
const app = express() 
const port = 5000
const bodyParser = require('body-parser'); 
const { User } = require('./models/User'); 

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true})); 

app.use(bodyParser.json())


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //에러 방지
}).then(() => console.log('Mongo DB Connected...'))
 .catch(err => console.log(err)) 

app.get('/', (req, res) => res.send('Hello World!! 안녕하세요!'))

app.post('/register', (req, res) => {
    
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({ success : false, err}) // 실패 시
        return res.status(200).json({
            success: true
        })
    }); 

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

