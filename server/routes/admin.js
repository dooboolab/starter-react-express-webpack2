/**
 * Created by hyochan on 12/19/15.
 */
var express = require('express');
var router = express.Router();
var connection = require('./mariasql');

var header = require('../appset/global/Header');
var resCode = require('../appset/global/ResCode');
var sha256 = require('sha256');

/* APIs */
router
    // 관리자 로그인
    .post('/', function(req, res){
        const admin = {
            id : req.body.id,
            pw : sha256(req.body.pw)
        };
        console.log("admin : " + admin.id);

        const result ={};

        const prep = connection.prepare("select * from users where id=:id and pw=:pw");
        connection.query(prep(admin), function (err, rows) {
            if (err) {
                console.log("login error : " + err);
                result.resCode = resCode.ERR_PARAM;
                result.err = err;
                header.sendJSON(result, res);
            }
            else {
                if(rows.length == 0){
                    result.resCode = resCode.NO_DATA;
                    header.sendJSON(result, res);
                }else{
                    result.resCode = resCode.SUCCESS;
                    if (req.session.admin) {
                        console.log("ALREADY HAVE SESSION : " + req.session.admin.id);
                    } else {
                        console.log("NOT LOGGED IN");
                    }
                    delete admin.pw;
                    console.log(JSON.stringify(admin));
                    req.session.regenerate(function () {
                        req.session.admin = admin;
                        req.session.success = 'Authenticated as ' + admin.id;
                        console.log("RECREATE SESSION : " + req.session.admin.id);
                        header.sendJSON(result, res);
                    });
                    // 로그인 시간 업데이트
                    const sql = "update admin set updated = now() where id = ?";
                    connection.query(sql, [user.admin], function (err, rows) {
                        if(err) { console.log(err);}
                        else { console.log("user login date updated");}
                    });
                }
            }
        });
    })
    // 관리자 로그아웃
    .get('/logout', function(req, res){
        const result ={};
        req.session.destroy(function(err){
            if(err){
                result.resCode = resCode.FAILED;
                result.errMsg = err.message;
            }
            else{
                console.log("logout success");
                result.resCode = resCode.SUCCESS;
            }
            header.sendJSON(result, res);
        });
    })
    // 사용자 로그인 여부 확인
    .get('/isLogged', function(req, res){
        const result = {};
        if(req.session.admin == undefined){
            result.resCode = resCode.FAILED;
            result.errMsg = "로그인되지 않았습니다. 로그인 해주세요.";
        }else{
            result.resCode = resCode.SUCCESS;
            result.id = req.session.admin.id;
        }
        header.sendJSON(result, res);
    })
;

module.exports = router;
