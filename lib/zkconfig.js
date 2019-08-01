'use strict';
const urlencode = require('urlencode');
const assert = require('assert');
const _ = require('lodash');
const debug = console.log;
/**
 * on app
 * @param {Application} app app
 */
module.exports = app => {
    app.addSingleton('zkconfig', createClient);
};
class ZKConfig {
    constructor(options, app) {
        assert(options && options.match, 'options and options.match is required');
        this.options = options;
        this.app = app;
        this.version = this.options.version || '1.0';
        this.rootPath = `/${this.app.name}/${this.version}/config`;
        this._subscribeMap = new Map(); // <path, data>
        this._reloading = new Map();
    }
    buildConfigPath(key) {
        return `${this.rootPath}/${key}`;
    }
    isMatch(key) {
        return this.options.match && this.options.match(key) || false;
    }
    async getZKClient() {
        return this.app.zk.createClient('localhost:2181');
    }
    async init() {
        const app = this.app;
        const client = await this.getZKClient();
        const config = app.config;
        const map = Object.entries(config).filter(input => {
            return this.isMatch(input[0]);
        });
        // debug(map);
        for (const [key, value] of map) {
            const path = this.buildConfigPath(key);
            const exists = await client.exists(path);
            // debug(exists);
            if (!exists) {
                await client.mkdirp(path, Buffer.from(JSON.stringify(value)));
            } else {
                await client.setData(path, Buffer.from(JSON.stringify(value)));
            }
            this._subscribeMap.set(path, value);
            client.watch(path, async (err, data, stat) => {
                if (err) {
                    // handle error
                    app.logger.error(err);
                    return;
                }
                app.logger.info('data => ', data && data.toString());
                // debug('stat => ', stat);
                try {
                    const newConfig = JSON.parse(data.toString());
                    await this.reload(key, newConfig);
                } catch (err) {
                    // should be json parse error
                    // do nothing 
                }
            });
        }
        // watch 本质是 getData, 只关注特定 node 的 data 变化
        //  watchChildren 本质是 getChildren ，只关心 node  的 add remove 事件。不关注 setData 事件
        // 假定外部调整了 node 的结点数，那么，是否需要调整这里的数据呢
        client.watchChildren(this.rootPath, async (err, children, stat) => {
            if (err) {
                app.logger.error(err);
                return;
            }
            app.logger.info(children);
            // debug(stat);
            // for (const key of children) {
            //     await this.reload(key);
            // }
        });
        app.coreLogger.info('[egg-zkconfig] init success');
    }
    /**
     * 
     * @param {*} key  对应的key名称
     * @param {*} [config] 不传入，表示需要自己获取
     */
    async reload(key, config) {
        const app = this.app;
        const client = await this.getZKClient();
        const path = this.buildConfigPath(key);
        // 取出设置中的 reload 方法，来重新加载对应的 config 的对应实例，此处测试 redis
        if (!config) {
            const data = await client.getData(path);
            config = JSON.parse(data.toString());
        }
        // debug('reload----check-------');
        // debug(path);
        // debug(config, typeof config);
        // debug('reload----start-------');
        if (this._reloading.has(key)) {
            return;
        }
        this._reloading.set(key, true);
        // debug(app.config[key]);
        // debug(app[key].createInstanceAsync);
        // debug(app[key].options.port);

        // 这里是否考虑一下，包装对应的实例，以便 reload 之后再开放使用
        try {
            await this.options.reload(app, key, config);
            this._subscribeMap.set(path, app.config[key]);
        } catch (err) {
            app.logger.error(err);
        }
        // debug(app.config[key]);
        // debug(app[key].createInstanceAsync);
        // debug(app[key].options.port);
        this._reloading.delete(key);
    }
}
async function createClient(config, app) {
    const zkconfig = new ZKConfig(config, app);
    app.coreLogger.info('[egg-zkconfig] start success');
    return zkconfig;
}