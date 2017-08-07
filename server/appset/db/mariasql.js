/**
 * Created by hyochan on 12/11/15.
 * https://github.com/mscdex/node-mariasql
 */
// var mysql = require('mysql');
const Client = require('mariasql');

const config = {
    development : {
        host : '127.0.0.1',
        user : 'root',
        port : '3306',
        password : 'your_password',
        db : 'starter',
        multipleStatements : true
    },
    production : {
        host : 'localhost',
        user : 'hyochan',
        port : '3306',
        password : 'your_password',
        db : 'swpswp',
        multipleStatements : true
    }
    /*
    production : {
        host : 'hyochan.org',
        user : 'hyochan',
        port : '3306',
        password : 'your_password',
        db : 'swipeswap',
        multipleStatements : true
    }
    */
};

const params = require('../global/Params');
console.log("env : " + params.env);

if(params.env === 'production'){
    // pool = mysql.createConnection(config.production);
    pool = new Client(config.production);
}
else{
    // pool = mysql.createConnection(config.development);
    pool = new Client(config.development);
}

module.exports = pool;