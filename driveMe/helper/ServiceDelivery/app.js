var helmet = require('helmet');
var express = require('express');
var config = require('./config');

var Session = require('express-session');
var MongoStore = require('connect-mongo')(Session);
var ios = require('express-socket.io-session');

var app = express();
app.use(helmet());

var server = require('http').Server(app);
var io = require('socket.io')(server); // add socket.io 'websockets'.
server.listen(config.port.socket); // listen for websockets on port 6661

//-| session |---------------------|
var session = Session({
    secret: config.sessionSecret,
    cookie: { // cookie stuff.
        maxAge: config.cookieMaxAge
    },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: config.database.use === 'cloud' ? config.database.cloud : config.database.local,
        ttl: 7 * 24 * 60 * 60 // 7 days.
    })
});

app.use(session);

io.use(ios(session, {
    autoSave: true
}));

//-| Socket.io Commands |-- -- -- -- -- -- -- -- -- [SEPARATOR] -|
io.on('connection', function(socket) {
    console.log('[*] Websocket connection found!' + '\n');

    var client = require('./lib/client/clientMiddleware');
    client.socketHandler(socket, io);
    /* socketHandler [events] list.
     *   'client_identity' 'client_register' 'disconnect' 'message' 'error'
     *   'client_ready' 'client_error'
     */

    var user = require('./lib/user/userMiddleware');
    user.socketHandler(socket, io);
    /* socketHandler [events] list.
     *   'login'
     *   'logout'
     *   'register'
     */

});

module.exports = app;
