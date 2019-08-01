'use strict';
const zkconfig = require('./lib/zkconfig');

module.exports = app => {
    zkconfig(app);
    app.beforeStart(async () => {
        // console.log('before start');
    });
    app.ready(async () => {
        // console.log('ready');
    });
};