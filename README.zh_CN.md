# egg-zkconfig

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-zkconfig.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-zkconfig
[travis-image]: https://img.shields.io/travis/eggjs/egg-zkconfig.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-zkconfig
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-zkconfig.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-zkconfig?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-zkconfig.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-zkconfig
[snyk-image]: https://snyk.io/test/npm/egg-zkconfig/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-zkconfig
[download-image]: https://img.shields.io/npm/dm/egg-zkconfig.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-zkconfig

<!--
Description here.
-->

## 依赖说明

### 依赖的 egg 版本

egg-zkconfig 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

### 依赖的插件
<!--

如果有依赖其它插件，请在这里特别说明。如

- security
- multipart

-->

## 开启插件

```js
// config/plugin.js
exports.zkconfig = {
  enable: true,
  package: 'egg-zkconfig',
};
```

## 使用场景

### todo
1.考虑实际中使用多进程模型，需要在每一个实例上一一对应上 zookeeper 中的设置，如何保证重启之后的关联性
2.对于官方的 sigleton 插件，处理 createInstance, createInstanceAsync 的 this 绑定，处理
client, clients, 等多种可能的插件配置
3.对于非官方的 插件加载，如何处理 reload 逻辑。
4.对于普通的配置，只需更新 config 即可的，如何统一管理。
5.优化树形结构，现阶段为 /project/version/config/key => data(json string)
6.待定：如何使得优先加载 zkconfig, 优先从远端读取配置，但是，这样会降低应用插件加载速度，影响启动时间。
7.对于增删结点的支持，允许外部添加，删除 config ？



- Why and What: 描述为什么会有这个插件，它主要在完成一件什么事情。
尽可能描述详细。
- How: 描述这个插件是怎样使用的，具体的示例代码，甚至提供一个完整的示例，并给出链接。

## 详细配置

请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 单元测试

<!-- 描述如何在单元测试中使用此插件，例如 schedule 如何触发。无则省略。-->

## 提问交流

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](LICENSE)
