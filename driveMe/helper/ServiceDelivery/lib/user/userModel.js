/**
 * Created by intralizee on 2016-06-07.
 */

var bcrypt = require('bcryptjs');
var User = require('../utils/db').User;

//-| create user 'added to [users] collection' |---|
module.exports.create = function create(user, cb) {
    let dbUser = new User({
        username : user.username,
        password : hash(user.password),
        contact : {
            email : user.email
        }
    });
    dbUser.save(function (err) {
        if (err) cb(err);
        else cb(null, dbUser);
    });
};
//-| remove |------------------------------------|
module.exports.remove = function remove(id, cb) {
    User.remove({_id: id}, function(err) {
        cb(err);
    });
};
//-| register |----------------------------------------|
module.exports.register = function register(user, cb) {
    if (user.username == null || user.email == null || user.password == null || user.username == '' || user.email == '' || user.password == '')
        cb('error');
    else {
        User.findOne({'contact.email': user.email}, function (err, dbUser) {
            if (err)
                return cb(err);
            if (dbUser)
                cb(null, 'email already exists error');
            else {
                User.findOne({username: user.username}, function (err, dbUser) {
                    if (err) return cb(err);
                    if (dbUser) cb(null, 'user already exists error');
                    else cb();
                });
            }
        });
    }
};
//-| authenticate |--------------------------------------------|
module.exports.authenticate = function authenticate(user, cb) {
    User.findOne({username: user.username},
        '-location -contact -__v',
        function (err, dbUser) {
            if (err) cb(err);
            else if (dbUser && bcrypt.compareSync(user.password, dbUser.password)) {
                storeLoginInformation(dbUser, user.ip);
                cb(null, dbUser);
            }
            else cb(null);
        }
    );
};

//-| get user by id |----------------------|
module.exports.get = function get(id, cb) {
    User.findOne({_id: id}, function (err, user) {
        if (err) cb(err);
        else cb(user);
    });
};
//-| get all users |-------------------|
module.exports.all = function all(cb) {
    User.find({}, function(err, users) {
        if (err) cb(err);
        else cb(users);
    });
};
//-| hash data 'a string' |--------|
function hash(data) {
    return bcrypt.hashSync(data, 8);
}
//-| store user IP Address and time of login. |-----------------|
function storeLoginInformation(user, ip) {
    if (user.info.ip.login.now != null)
        user.info.ip.previous = user.info.ip.now;
    if (user.info.date.login.now != null)
        user.info.date.login.previous = user.info.date.login.now;
    user.info.date.login.now = Date.now();
    user.info.date.login.history.push( {
        date: Date.now()
    });
    user.info.ip.login.now = ip;
    user.info.ip.login.history.push({
        ip: ip
    });
    user.save();
}