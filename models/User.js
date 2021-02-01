const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        type : String,
        maxlength: 5
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
    }

}) 

const User = mongoose.model('User', userSchema)

module.exports = { User }