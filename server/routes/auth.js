/**
 * Created by hyochan on 12/19/15.
 */
const express = require('express');
const router = express.Router();
const connection = require('../appset/db/mariasql');

const header = require('../appset/global/Header');
const resCode = require('../appset/global/ResCode');
const nodeConst = require('../appset/global/NodeConst');
const myAuth = require('../appset/global/MyAuth');
const params = require('../appset/global/Params');

const sha256 = require('sha256');
const async = require('async');
const jwt = require('jsonwebtoken');
const flakeIdgen = require('flake-idgen');
const flakeId = new flakeIdgen();
const intformat = require('biguint-format');
const nodemailer = require('nodemailer');

/* APIs */
router
    // 사용자 로그인 : 사용자일 경우 jwt 이용
    .post('/login', function(req, res){
        const result ={};
        const email = req.body.email;
        const pw = req.body.pw;
        const token = req.body.token;
        if(email && pw){  // email이랑 pw로 로그인한 경우
            async.waterfall([
                function(callback){
                    const user = {
                        email: email,
                        pw: sha256(pw)
                    };
                    const prep = connection.prepare("select * from users where email=:email and pw=:pw limit 1");
                    connection.query(prep(user), function (err, rows) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null, rows, user);
                        }
                    });
                },
                // 2. delete that constains user_id
                function(user, rows, callback){
                    const userId = rows._id;
                    if(rows.length === 0){
                        result.resCode = resCode.NO_DATA;
                        result.err = "user is zero";
                        header.sendJSON(result, res);
                    } else{
                        // 로그인 시간 업데이트
                        const sql = "update users set updated = now() where email = :email";
                        connection.query(sql, user, function (err) {
                            if(err) {
                                console.log("error updating user udpated time");
                                return callback(err);
                            }
                            else {
                                console.log("user login date updated");
                                const payLoad = {
                                    id : userId
                                };
                                const token = myAuth.signToken(payLoad);
                                result.resCode = resCode.SUCCESS;
                                result.token = token;
                                header.sendJSON(result, res);
                            }
                        });
                    }
                }
            ], function(err){
                result.resCode = resCode.FAILED;
                result.err = err;
                header.sendJSON(result, res);
            });
        } else {
            result.resCode = resCode.NO_REQ_PARAM;
            result.err = "req params are missing";
            header.sendJSON(result, res);
        }
    })
    .post('/signup', function(req, res){
        const result = {};
        // 1. 파라미터가 다 들어왔는지 확인
        const user = {
            email : req.body.email,
            pw : req.body.pw
        };
        if(!user.email || !user.pw){
            console.log("no request params");
            result.resCode = resCode.NO_REQ_PARAM;
            header.sendJSON(result, res);
        } else {
            user.pw = sha256(user.pw);
            // 3. 중복 이메일이 있는지 확인
            let prep = connection.prepare(
                "insert ignore into users(_id, email, pw, created, updated) values (null, :email, :pw, now(), now())"
            );
            connection.query(prep(user), function (err, rows) {
                if (err) {
                    console.log("signup error : " + err);
                    result.resCode = resCode.FAILED;
                    result.err = err;
                } else if(rows.info.affectedRows == 0){
                    console.log("already inserted email");
                    result.resCode = resCode.ALREADY_INSERTED;
                    result.err = "email is already signed up";
                } else {
                    // 4. 이상없으면 디비에 넣고 token 발급
                    console.log("signup success : " + rows.info.insertId);
                    result.resCode = resCode.SUCCESS;
                    const payLoad = {
                        id : rows.info.insertId
                    };
                    const token = myAuth.signToken(payLoad);
                    result.token = token;
                }
                header.sendJSON(result, res);
            });
        }
    })
    .post('/isAuthenticated', myAuth.isAuthenticated(), function(req, res){
        const result = {};
        if(req.err){
            result.resCode = resCode.FAILED;
            result.err = req.err;
        }
        else if(!req.user){
            result.resCode = resCode.NO_DATA;
            result.err = "req param token is missing";
        } else {
            result.resCode = resCode.SUCCESS;
            result.user = req.user;
        }
        header.sendJSON(result, res);
    })
;

module.exports = router;
