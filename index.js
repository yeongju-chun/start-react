const express = require('express') //package.json의 의존성에 있는 자료 중, 가져올 자료 선택
const app = express() //가져온 의존성 실행
const port = 5000
const bodyParser = require('body-parser'); //body-parser 가져오기
const { User } = require('./models/User'); //User 가져오기

const config = require('./config/key');

//application/x-www/form-urlencoded
//바디 파싱 설정
app.use(bodyParser.urlencoded({extended: true})); 

//application/json (응답에서 json을 사용할 수 있도록 설정)
app.use(bodyParser.json())


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //에러 방지
}).then(() => console.log('Mongo DB Connected...'))
 .catch(err => console.log(err)) //확인이 잘 된건지 확인

app.get('/', (req, res) => res.send('Hello World!! 안녕하세요!'))
// 루트 디렉토리에 오면 해당 함수를 실행
// 클라이언트에 해당 메세지 전달

app.post('/register', (req, res) => {
    //회원가입할 때 필요한 정보들을  client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({ success : false, err}) // 실패 시
        return res.status(200).json({
            success: true
        }) // 성공 시 
    }); // save(콜백함수)는 MongoDB에서 오는 함수

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// 리스너가 해당 포트에 접근을 인지하면 터미널에 해당 작업을 함

