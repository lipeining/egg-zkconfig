'use strict';

module.exports = app => {
    const { router, controller } = app;

    router.get('/', controller.home.index);

    router.get('/config', controller.config.list);
    router.post('/config', controller.config.add);
};