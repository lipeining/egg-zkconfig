'use strict';

const mock = require('egg-mock');

describe('test/zkconfig.test.js', () => {
    let app;
    const sleep = async (timeout) => {
        return await new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        })
    }
    before(() => {
        app = mock.app({
            baseDir: 'apps/zkconfig-test',
        });
        return app.ready();
    });

    after(() => app.close());
    // afterEach(mock.restore);

    it('should GET /', () => {
        return app.httpRequest()
            .get('/')
            .expect('hi, zkconfig')
            .expect(200);
    });
    it('should GET /config', async () => {

        const res = await app.httpRequest()
            .get('/config')
            .expect(200);
    });
    it('wait 5 second', async () => {
        // {"default":{},"app":true,"agent":false,"supportTimeCommand":true,"host":"127.0.0.1","port":6100}
        app.mockCsrf();
        await sleep(2500)
        await app.httpRequest()
            .post('/config')
            .send({ key: 'keys', value: JSON.stringify('222222') });
        await app.httpRequest()
            .post('/config')
            .send({ key: 'redis', value: JSON.stringify({ port: 6100 }) });
        await sleep(2500);
    })
});