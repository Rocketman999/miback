const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'daemon-123',
    database: 'kaoriwi',
    connectionLimit: 5 
});

module.exports = pool;