/**
 * Created by hyochan on 2017. 2. 14..
 */

const config = {
    /*redis config: host, port 등*/
    development : {
        host : '127.0.0.1',
        port : '6379'
    },
    production : {
        host : 'hyochan.org',
        port : '6379'
    }
};

exports.config = config;