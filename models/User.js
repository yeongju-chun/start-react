const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength: 50
    },
    email : {
        type: String,
        trim: true, // 글자 사이의 공백을 없애줌
        unique: 1
    },
    password : {
        type : String
    },
    lastname : {
        type : String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//pre() > MongoDB에서 가져온 함수 특정 함수를 실행하기 이전에 실행되는 함수
userSchema.pre('save', function(next) {
    // 비밀번호 암호화
    var user = this;
    
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err); // 에러 시, stop
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err); // 에러 시, stop
                user.password = hash;
                return next(); // 에러가 나지 않았다면, plain password를 hash로 바꿔줌
            }); 
        });
    } else {
        next();
    }

}) 

// userSchema에 메소드 생성하는 방법
userSchema.methods.comparePassword = function(plainPassword, cb) {
    // 암호화된 해시함수는, 복호화할 수 없으므로, plainPassword를 해시함수를 이용해 암호화해서 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

// 토큰 생성을 위한 메소드 생성
userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    // user._id + 'secretToken' = token -> _id 뒤에 붙는 정보들도 기억을 해야 함?
    // toHexString() 메소드는, 객체로 넘어오는 _id를 plain Object로 바꾸기 위함

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
}

const User = mongoose.model('User', userSchema)

module.exports = { User }