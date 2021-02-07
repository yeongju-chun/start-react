const express = require('express') 
const app = express() 
const port = 5000
const bodyParser = require('body-parser'); 
const cookieparser = require('cookie-parser');
const { User } = require('./models/User'); 

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true})); 

app.use(bodyParser.json());
app.use(cookieparser());

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


app.post('/login', (req, res) =>  {
    //1. 데이터베이스에서 요청한 이메일 찾기
    User.findOne({email : req.body.email}, (err, userInfo) => {
        if(!userInfo) {
            return res.json({
                loginSuccess : false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //2. 요청한 이메일과 비밀번호가 같은지 확인
        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({loginSuccess : false, message : "비밀번호가 틀렸습니다."})
            }else {
                //3. 비밀번호 맞다면 토큰 생성하기
                userInfo.generateToken((err, user) => {
                    if(err) return res.status(400).send(err);

                    // 토큰을 저장한다. 어디에? 쿠키 or 로컬스트리지 
                    // cookieParser를 설치하여 쿠기 파싱을 도움
                    // npm install cookie-parser --save
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess : true, userId : user._id});
                });
            }
        })
    })

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

