/**
 * Created by intralizee on 2016-06-07.
 */

var config = require('./../../config');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.database.use === 'cloud' ? config.database.cloud : config.database.local);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(cb) {
    console.log('[!] Successfully connected to MongoDB...');
    config.database.use === 'cloud' ? console.log(config.database.cloud) : console.log(config.database.local);
});

// When the mongodb server goes down, mongoose emits a 'disconnected' event
mongoose.connection.on('disconnected', () => { console.log('-> lost connection'); });
// The driver tries to automatically reconnect by default, so when the
// server starts the driver will reconnect and emit a 'reconnect' event.
mongoose.connection.on('reconnect', () => { console.log('-> reconnected'); });

// Mongoose will also emit a 'connected' event along with 'reconnect'. These
// events are interchangeable.
mongoose.connection.on('connected', () => { console.log('-> connected'); });

var clientSchema = mongoose.Schema({
    socketId: String,
    uuid: String,
    token: String,

    channel: String,
    online: false,

    timestamp: Date
});

var publicKeysSchema = mongoose.Schema({
    socket_id: String,
    publicKeyServer: String,
    secretKeyServer: String
});

var forgeSchema = mongoose.Schema({
    socket_id: String,
    key: String,
    iv: String
});

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    contact: {
        email: String
    },
    info: {
        ip : {
            login : {
                now: String,
                previous: String,
                history: {
                    type: Array,
                    default: []
                }
            }
        },
        date : {
            registration: {
                type: Date,
                default: Date.now
            },
            login: {
                now : Date,
                previous : Date,
                history : {
                    type: Array,
                    default: []
                }
            }
        }
    },
    devices: []
});

exports.User = mongoose.model('User', userSchema);
exports.Clients = mongoose.model('Clients', clientSchema);