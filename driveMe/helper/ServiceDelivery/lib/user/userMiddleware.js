var User = require('./userModel');

//-| socket handler |------------------|
exports.socketHandler = function(socket, io) {

    socket.on('login', function(data) {

        var user = {
            username : data.username,
            password : data.password,
            ip : socket.request.connection.remoteAddress
        };

        User.authenticate(user, function(err, dbUser) {
            if (err) { // handle error.
                console.log('socket.login error: ' + err);
                socket.emit('failure', {
                    api: 'login',
                    status: 'service offline',
                    socketid: socket.id.toString(),
                    session: socket.handshake.session
                });
            }
            if (dbUser) { // credentials correct - login user.
                console.log('user data ' + JSON.stringify(dbUser));
                socket.handshake.session.user = {
                    id: dbUser.id,
                    username: dbUser.username
                };
                console.log('session data ' + JSON.stringify(socket.handshake.session.user));
                socket.handshake.session.save();
                socket.emit('success', {
                    api: 'login',
                    status: 'online',
                    socketid: socket.id.toString(),
                    session: socket.handshake.session
                });
            } else { // credentials incorrect - login failed.
                socket.emit('failure', {
                    api: 'login',
                    status: 'incorrect details',
                    socketid: socket.id.toString(),
                    session: socket.handshake.session
                });
            }
        });
    });

    socket.on('logout', function() {
        if (socket.handshake.session.user != null) {
            if (socket.handshake.session.user) {
                delete socket.handshake.session.user;
                socket.handshake.session.save();
            }
            socket.emit('success', {
                api: 'logout',
                status: 'user session removed',
                socketid: socket.id.toString(),
                session: socket.handshake.session
            });
        }
    });

    socket.on('refresh', function(data) { // todo fix this is not secure
        console.log('socket.on - refresh has ran..');
        console.log(JSON.stringify(data));
        if (data.session.user != null) {
            socket.handshake.session.user = {
                id: data.session.user.id,
                username: data.session.user.username
            };
            socket.handshake.session.save();
            socket.emit('success', {
                api: 'refresh',
                status: 'online',
                socketid: socket.id.toString(),
                session: socket.handshake.session
            });
        }
        else {
            socket.emit('failure', {
                api: 'refresh',
                status: 'service offline',
                socketid: socket.id.toString(),
                session: socket.handshake.session
            });
        }
    });

    socket.on('register', function(data) {
        console.log('on register has just ran');
        var user = {
            username : data.username,
            password : data.password,
            email : data.email,
            ip : socket.request.connection.remoteAddress
        };
        User.register(user, function(err, status) {
            if (err) {
                console.log('socket.register error: ' + err);
                socket.emit('failure', {
                    api: 'register',
                    status: 'service offline',
                    socketid: socket.id.toString(),
                    session: socket.handshake.session
                });
            }
            else if (status == 'email already exists error') {
                socket.emit('failure', {
                    api: 'register',
                    status: 'email exists',
                    socketid: socket.id.toString(),
                    session: socket.handshake.session
                });
            }
            else if(status == 'user already exists error') {
                socket.emit('failure', {
                    api: 'register',
                    status: 'username exists',
                    socketid: socket.id.toString(),
                    session: socket.handshake.session
                });
            }
            else { // Create account.
                User.create(user, function(err, user) {
                    if (err) {
                        console.log('socket.create error: ' + err);
                        socket.emit('failure', {
                            api: 'register',
                            status: 'service offline',
                            socketid: socket.id.toString(),
                            session: socket.handshake.session
                        });
                    }
                    else {
                        User.authenticate(user, function (err, dbUser) {
                            if (err) { // handle error.
                                console.log('socket.login error: ' + err);
                                socket.emit('failure', {
                                    api: 'login',
                                    status: 'service offline',
                                    socketid: socket.id.toString(),
                                    session: socket.handshake.session
                                });
                            }
                            if (dbUser) { // credentials correct - login user.
                                socket.handshake.session.user = {
                                    id: dbUser.id,
                                    username: dbUser.username
                                };
                                socket.handshake.session.save();
                                socket.emit('success', {
                                    api: 'login',
                                    status: 'online',
                                    socketid: socket.id.toString(),
                                    session: socket.handshake.session
                                });
                            }
                        })
                    }
                });
            }
        })
    });

};