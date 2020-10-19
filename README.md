[中文](docs/README_CN.md)

# Chii

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![License][license-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/chii.svg
[npm-url]: https://npmjs.org/package/chii
[travis-image]: https://img.shields.io/travis/liriliri/chii.svg
[travis-url]: https://travis-ci.org/liriliri/chii
[license-image]: https://img.shields.io/npm/l/chii.svg

Remote debugging tool like [weinre](https://people.apache.org/~pmuellr/weinre/docs/latest/Home.html), replacing web inspector with the latest [chrome devtools frontend](https://github.com/ChromeDevTools/devtools-frontend).

![Chii](./docs/screenshot.jpg)

## Build Locally
1. get submoduls `git submodule update --init --recursive`
2. install node modules `npm i`
2. run ci command `npm run ci`
 
## Demo

![Demo](./docs/qrcode.png)

Browse it on your phone: [https://chii.liriliri.io/tests/demo.html](https://chii.liriliri.io/tests/demo.html)

Open [https://chii.liriliri.io/](https://chii.liriliri.io/) and click inspect to start debugging the demo page.

In order to try it for different sites, execute the script below on browser address bar.

```javascript
javascript:(function () { var script = document.createElement('script'); script.src="//chii.liriliri.io/target.js"; document.body.appendChild(script); })();
```

## Install

You can get it on npm.

```bash
npm install chii -g
```

## Usage

Start the server with the following command.

```bash
chii start -p 8080
```

To run over https
```bash
chii start -p 8080 --ssl=true

Use this script to inject the target code into your webpage.

```html
<script src="//host-machine-ip:8080/target.js"></script>
```

Then browse to localhost:8080 to start debugging your page.

## Related Projects

* [whistle.chii](https://github.com/liriliri/whistle.chii): Whistle Chii plugin.
* [chobitsu](https://github.com/liriliri/chobitsu): Chrome devtools protocol JavaScript implementation.