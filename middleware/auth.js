const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리를 해주는 함수

    //1. 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    //2. 토큰 복호화 후, 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        //4. 유저 없으면 인증 no!
        if(!user) return res.json({ isAuth : false, error : true });
        //3. 유저 있으면 인증 ok
        req.token = token;
        req.user = user;
        // next 함수가 없다면 middleware에서 빠져나가지 못함
        next();
    });


}

module.exports = { auth };