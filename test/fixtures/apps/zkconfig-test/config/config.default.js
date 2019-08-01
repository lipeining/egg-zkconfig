'use strict';

const sequelizeLoader = require('egg-sequelize/lib/loader');
const _ = require('lodash');
exports.keys = '123456';
exports.redis = {
    client: {
        host: '127.0.0.1',
        port: 6000,
        db: 8,
        password: '',
    },
};
exports.sequelize = {
    dialect: 'mysql',
    database: 'test',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root',
    pool: {
        max: 200,
    },
    operatorsAliases: false,
};
exports.zkconfig = {
    client: {
        match: (name) => {
            return ['redis', 'sequelize', 'session', 'jsonp', 'keys', 'proxy'].includes(name);
        },
        reload: async (app, name, config) => {
            if (name === 'redis') {
                if (!_.isEqual(app.config[name].client, config.client || config)) {
                    const newConfig = Object.assign(app.config[name].client, config.client || config);
                    console.log('default.js newConfig', newConfig);
                    // 因为这个 createInstanceAsync 绑定的是 sigleton
                    const createInstanceAsync = app.redis.createInstanceAsync;
                    app.redis = await createInstanceAsync(newConfig);
                    app.redis.createInstanceAsync = createInstanceAsync;
                }
            } else if (name === 'sequelize') {
                // sequelizeLoader(app);
            } else {
                if (!_.isEqual(app.config[name], config)) {
                    // console.log(name);
                    // console.log(config);
                    if (_.isObject(config)) {
                        Object.assign(app.config[name], config);
                    } else {
                        app.config[name] = config;
                    }
                    console.log('default.js newConfig', app.config[name]);
                }
            }
            return;
        }
    }
}