/**
 * Created by hyochan on 2017. 2. 14..
 */
'use strict';

const jwt = require('jsonwebtoken');
const compose = require('composable-middleware');
const SECRET = 'key0001 developer hyochan';
const EXPIRES = 1440; // 1 hour

// JWT 토큰 생성 함수
function signToken(payLoad) {
    return jwt.sign(
        payLoad,
        SECRET, {
            algorithm : 'HS256',
            expiresIn: EXPIRES
        }
    );
}

// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
    return compose()
    // Validate jwt
        .use(function(req, res, next) {
            jwt.verify(req.headers.authorization, SECRET, function(err, decoded){
                if(err){
                    req.err = err;
                    return next();
                } else{
                    req.user = {
                        id : decoded.id // 다른 정보 빼고 아이디만 보낸다
                    };
                    console.log("id : " + JSON.stringify(decoded));
                    return next();
                }
            });
        });
}


exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;