/**
 * Created by hyochan on 12/12/15.
 * https://github.com/mscdex/node-mariasql
 */

const params = require('./server/appset/global/Params');
params.env = 'production';

// 모듈 추출
const connection = require('./server/appset/db/mariasql');

const
    adminTable = "admins",
    userTable = "users",
    locationTable = "locations",
    userAuthLinkTable = "user_auth_link",
    findPwTable = "find_pw"
;

connection.query('DROP TABLE IF EXISTS ' + findPwTable);
connection.query('DROP TABLE IF EXISTS ' + adminTable);
connection.query('DROP TABLE IF EXISTS ' + locationTable);
connection.query('DROP TABLE IF EXISTS ' + userTable);

connection.query('CREATE TABLE ' + adminTable + '(' +
    '_id INTEGER AUTO_INCREMENT, ' +
    'email VARCHAR(255) NOT NULL UNIQUE, ' +
    'pw VARCHAR(255) NOT NULL, ' +
    'name VARCHAR(255), ' + // 한글 1자당 utf8일 떄는 3바이트씩
    'photo VARCHAR(255), ' +
    'created datetime, ' +
    'updated datetime, ' +
    'primary key(_id),' +
    'index(email)' +
    ')'
);
connection.query('CREATE TABLE ' + userTable + '(' +
        '_id INTEGER AUTO_INCREMENT, ' +
        'email VARCHAR(255) NOT NULL UNIQUE, ' +
        'pw VARCHAR(255) NOT NULL, ' +
        'nickname VARCHAR(255), ' + // 한글 1자당 utf8일 떄는 3바이트씩
        'first_name VARCHAR(255), ' +
        'last_name VARCHAR(255), ' +
        'picture VARCHAR(255), ' +
        'social VARCHAR(255), ' +
        'authenticated tinyint(1), ' + 
        'created datetime, ' +
        'updated datetime, ' +
        'primary key(_id),' +
        'index(email)' +
    ')'
);
connection.query('CREATE TABLE ' + locationTable + '(' +
        '_id INTEGER AUTO_INCREMENT, ' +
        'user_id INTEGER NOT NULL UNIQUE, ' +
        'lat DECIMAL(11, 7) NOT NULL, ' +
        'lng DECIMAL(11, 7) NOT NULL, ' +
        'primary key(_id), ' +
        'foreign key (user_id) REFERENCES ' + userTable + ' (_id)' +
        ')'
);
connection.query('CREATE TABLE ' + findPwTable + '(' +
        '_id INTEGER AUTO_INCREMENT, ' +
        'user_id INTEGER NOT NULL UNIQUE, ' +
        'url TEXT, ' +
        'primary key(_id), ' +
        'foreign key (user_id) REFERENCES ' + userTable + ' (_id)' +
        ')'
);



/*
// prepare statement example
var prep = c.prepare('SELECT * FROM users WHERE id = :id AND name = :name');

c.query(prep({ id: 1337, name: 'Frylock' }), function(err, rows) {
  if (err)
    throw err;
  console.dir(rows);
});

c.end();
*/

connection.end();
