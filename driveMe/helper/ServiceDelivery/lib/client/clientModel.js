/**
 * Created by intralizee on 2016-08-22.
 */

var Clients = require('../utils/db').Clients;

//-| get UUID of socket |------------------------------|
module.exports.getUuid = function getUuid(socket, cb) {
    Clients.findOne({
        socketId: socket.id.toString(),
    }, function (err, client) {
        if (err || client == null)
            return cb({});
        return cb(client.uuid);
    });
};
//-| get socket Id |-----------------------------------------|
module.exports.getSocketId = function getSocketId(uuid, cb) {
    Clients.findOne({
        uuid: uuid
    }, function (err, client) {
        if (err || client == null) return cb({});
        return cb(client.socketId);
    });
};
//-| update socket Id |----------------------------------------------|
module.exports.updateSocketId = function updateSocketId(socket, cb) {
    Clients.update({
        uuid: socket.uuid
    }, {
        $set: {socketId: socket.socketId, online: true, token: socket.token, timestamp: new Date().getTime()}
    }, function(err, client) {
        if (err) return cb({uuid: socket.uuid, status: 401}); // update error
        return cb({uuid: socket.uuid, status: 201}); // SocketId and presence updated for device
    });
};
//-| register socket |-----------------------------------------------|
module.exports.registerSocket = function registerSocket(data, cb) {
    var uuid = require('uuid');
    var deviceChannel = data.channel ? data.channel : 'main';
    var token = data.token ? data.token : generateToken();

    data.uuid = data.uuid ? data.uuid : uuid.v4();

    Clients.findOne({ uuid: data.uuid }, function(err, client) {
        if (client) {
            console.log('registerSocket found client');
            data.uuid = uuid.v4();
            client.timestamp = new Date().getTime();
            client.token = token;
            client.channel = deviceChannel;
            client.online = true;
        }
        else {
            console.log('registerSocket did not find client');
            client = new Clients({
                uuid: data.uuid,
                timestamp: new Date().getTime(),
                token: token,
                channel: deviceChannel,
                online: true
            });
        }
        client.save(function(err, client) {
            if (err) { // client not registered
                cb({
                    errors: [{
                        message: 'Client not registered',
                        code: 500
                    }]
                });
            }
            else cb(client); // client registered
        });
    });
    function generateToken() { // generates random token of length 50
        var rand = function() {
            return Math.random().toString(36).substr(2); // remove `0.' from '0.au34...` to get 'au34...
        };
        return (rand() + rand() + rand()).toString().substr(0, 50);
    }
};