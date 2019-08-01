'use strict';

const Controller = require('egg').Controller;

class ConfigController extends Controller {
    async list() {
        this.ctx.body = this.config.zkconfig;
    }
    async add() {
        const { ctx, app, config } = this;
        const { query, body } = ctx.request;
        const key = body.key;
        const value = JSON.parse(body.value);
        const client = await app.zk.createClient('localhost:2181');
        const path = app.zkconfig.buildConfigPath(key);
        const exists = await client.exists(path);
        if (!exists) {
            await client.mkdirp(path, Buffer.from(JSON.stringify(value)));
        } else {
            await client.setData(path, Buffer.from(JSON.stringify(value)));
        }
    }
}

module.exports = ConfigController;