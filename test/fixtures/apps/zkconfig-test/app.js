module.exports = async app => {
    app.beforeStart(async () => {
        console.log('ready');
        // console.log(app.zkconfig);
        const client = app.zk.createClient('localhost:2181');
        await client.ready();
        await app.zkconfig.init();
    });
    // app.ready(async () => {
    //     console.log('ready');
    //     // console.log(app.zkconfig);
    //     const client = app.zk.createClient('localhost:2181');
    //     await client.ready();
    //     await app.zkconfig.init();
    // });
    app.on('error', async (err, ctx) => {
        console.log(err);
        ctx.logger.info(err);
    });
};