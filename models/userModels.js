const db = require('../config/database');


exports.createUser = (user, callback) =>{
    const {firstname, lastname, email, password} = user;
    db.query('INSERT INTO LoginSystem (firstname, lastname, email, password) VALUES (?,?,?,?)', [firstname, lastname, email, password], callback);
}

exports.findUser = (email, callback) =>{
    db.query('SELECT id,firstname, lastname, email, password FROM LoginSystem WHERE email = ?', [email], callback);
}
