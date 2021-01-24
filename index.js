const express = require('express') //package.json의 의존성에 있는 자료 중, 가져올 자료 선택
const app = express() //가져온 의존성 실행
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://cyj:jonghyo93419**@start-react.zrqv2.mongodb.net/start-react?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //에러 방지
}).then(() => console.log('Mongo DB Connected...'))
 .catch(err => console.log(err)) //확인이 잘 된건지 확인

app.get('/', (req, res) => res.send('Hello World!! 안녕하세요!'))
// 루트 디렉토리에 오면 해당 함수를 실행
// 클라이언트에 해당 메세지 전달

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// 리스너가 해당 포트에 접근을 인지하면 터미널에 해당 작업을 함

