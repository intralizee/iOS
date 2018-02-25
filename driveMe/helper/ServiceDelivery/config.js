module.exports = {
    sessionSecret: '12iVzEwvXu3AHwxKjAw2UD6CYyC29vGgbGK86mcCJCXvxWNj3C',
    cookieMaxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
    database: {
        use: 'cloud', // set to 'cloud' or 'local' to switch (development)
        cloud: 'mongodb://lillyseed:4W49n7wvvEp886gj7vnn4B9gg@ds247698.mlab.com:47698/lillyseed',
        local: 'mongodb://127.0.0.1:27017/lillyseed'
    },
    port: {
        server: 7070,
        socket: 6360
    },
    log: false,
    logFileName: 'delivery_log',
    appName: 'delivery',
    gcloud: {
        use: 'cloud',
        cloud: '/home/intralizee/Keys/intralizee.json',
        local: '/Users/intralizee/Development/Keys/intralizee.json'
    }
};