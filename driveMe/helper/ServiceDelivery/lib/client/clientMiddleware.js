/**
 * Created by intralizee on 2016-08-22.
 */

var Client = require('./clientModel');

//-| socket handler |------------------|
exports.socketHandler = function(socket, io) {
    //-| (request) client identity |--------------------------------|
    socket.emit('client_identity', {socketid: socket.id.toString()});

    //-| (received) client identity |-----------|
    socket.on('client_identity', function(data) {

        console.log('client_identity has ran...');

        data['socketId'] = socket.id.toString();

        Client.updateSocketId(data, function(auth) {
            if (auth.status == 201) {
                socket.emit('client_ready', {
                    api: 'connect',
                    status: auth.status,
                    socketid: socket.id.toString(),
                    uuid: data.uuid
                });
                socket.join(data.uuid); // each socket can be reached by their uuid as channel.
            } else {
                socket.emit('client_error', {
                    api: 'connect',
                    status: auth.status,
                    socketid: socket.id.toString(),
                    uuid: data.uuid
                });
            }
        });
    });

    //-| (received) client register |---------------|
    socket.on('client_register', function(data, fn) {
        if (data == undefined)
            data = {};

        console.log('client_register has ran...');

        data['socketId'] = socket.id.toString();

        Client.getUuid(socket, function(uuid) {
            Client.registerSocket(data, function(results) {
                try {
                    fn(results);
                } catch(error) {
                    console.log('client_register error: ' + error);
                }
            });
        });
    });

    //-| (received) client disconnect |------------|
    socket.on('disconnect', function(data) {
        console.log('disconnect has ran...');
        Client.getUuid(socket, function(uuid) {
            socket.broadcast.emit('message', {
                api: 'disconnect',
                client: uuid
            });
        });
    });

    //-| (received) message |------------|
    socket.on('message', function(data) {
        if (data == undefined)
            data = {};
        else if (typeof data !== 'object')
            data = JSON.parse(data);

        Client.getUuid(socket, function(uuid) {

            console.log(data.clients);

            var send = {
                sender: uuid,
                type: data.clients == ('all' || '*') ? 'broadcast' : 'message',
                message: data.message == null ? '' : data.message
            };

            console.log(JSON.stringify(send));

            if (data.clients == 'all' || data.clients == '*') // 'broadcast' message to everyone
                socket.broadcast.emit('message', send);
            else { //
                var clients = data.clients;
                if (typeof clients === 'string')
                    clients = [clients];
                clients.forEach(function(client) {
                    Client.getSocketId(client, function(socketId) {
                        console.log('[*] sent message to client with socketId: ', socketId);
                        socket.to(socketId).emit('message', send);
                    });
                    //console.log('broadcasting to client channel: ' + client);
                    //socket.broadcast.to(client).emit('message', send); // 'channel' message to specific clients
                });
            }
        });
    });

    //-| (error) socket error |---------|
    socket.on('error', function(error) {
        console.log('error has ran...');
        console.log('socket error: ' + error);
    });

};