<div align="center">
  <a href="https://github.com/jameswlane/status-board">
    <img src="https://github.com/jameswlane/status-board-logo/raw/master/status-board-logo.png">
  </a>
</div>

# status-board
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red.svg)](https://github.com/airbnb/javascript)
[![Slack Channel](https://slackin-xmjstmxrio.now.sh/badge.svg)](https://slackin-xmjstmxrio.now.sh/)
[![Module LTS Adopted'](https://img.shields.io/badge/Module%20LTS-Adopted-brightgreen.svg?style=flat)](http://github.com/CloudNativeJS/ModuleLTS)

|        | CircleCI                                                                                                                                              | Dependencies                                                                                                                           | Dev Dependencies                                                                                                                                       | Maintainability                                                                                                                                                          | Test Coverage                                                                                                                            | License                                                                                                                                                                                                        |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| master | [![CircleCI](https://circleci.com/gh/jameswlane/status-board/tree/master.svg?style=svg)](https://circleci.com/gh/jameswlane/status-board/tree/master) | [![dependencies Status](https://david-dm.org/jameswlane/status-board/master/status.svg)](https://david-dm.org/jameswlane/status-board) | [![devDependencies Status](https://david-dm.org/jameswlane/status-board/master/dev-status.svg)](https://david-dm.org/jameswlane/status-board?type=dev) | [![Maintainability](https://api.codeclimate.com/v1/badges/361a35856d52f3e4bf72/maintainability)](https://codeclimate.com/github/jameswlane/status-board/maintainability) | [![codecov](https://codecov.io/gh/jameswlane/status-board/branch/master/graph/badge.svg)](https://codecov.io/gh/jameswlane/status-board) |  |
| 1.x    | [![CircleCI](https://circleci.com/gh/jameswlane/status-board/tree/1.x.svg?style=svg)](https://circleci.com/gh/jameswlane/status-board/tree/1.x)       | [![dependencies Status](https://david-dm.org/jameswlane/status-board/1.x/status.svg)](https://david-dm.org/jameswlane/status-board)    | [![devDependencies Status](https://david-dm.org/jameswlane/status-board/1.x/dev-status.svg)](https://david-dm.org/jameswlane/status-board?type=dev)    |                                                                                                                                                                          | [![codecov](https://codecov.io/gh/jameswlane/status-board/branch/1.x/graph/badge.svg)](https://codecov.io/gh/jameswlane/status-board)    |                                                                                                                                                                                                                |
| 2.x    | [![CircleCI](https://circleci.com/gh/jameswlane/status-board/tree/2.x.svg?style=svg)](https://circleci.com/gh/jameswlane/status-board/tree/2.x)       | [![dependencies Status](https://david-dm.org/jameswlane/status-board/2.x/status.svg)](https://david-dm.org/jameswlane/status-board)    | [![devDependencies Status](https://david-dm.org/jameswlane/status-board/2.x/dev-status.svg)](https://david-dm.org/jameswlane/status-board?type=dev)    |                                                                                                                                                                          | [![codecov](https://codecov.io/gh/jameswlane/status-board/branch/2.x/graph/badge.svg)](https://codecov.io/gh/jameswlane/status-board)    |                                                                                                                                                                                                                |
| beta   | [![CircleCI](https://circleci.com/gh/jameswlane/status-board/tree/beta.svg?style=svg)](https://circleci.com/gh/jameswlane/status-board/tree/beta)     | [![dependencies Status](https://david-dm.org/jameswlane/status-board/beta/status.svg)](https://david-dm.org/jameswlane/status-board)   | [![devDependencies Status](https://david-dm.org/jameswlane/status-board/beta/dev-status.svg)](https://david-dm.org/jameswlane/status-board?type=dev)   |                                                                                                                                                                          | [![codecov](https://codecov.io/gh/jameswlane/status-board/branch/beta/graph/badge.svg)](https://codecov.io/gh/jameswlane/status-board)   |                                                                                                                                                                                                                |



[![Waffle.io - Columns and their card count](https://badge.waffle.io/jameswlane/status-board.svg?columns=all)](https://waffle.io/jameswlane/status-board)

<a href="https://www.patreon.com/jameswlane">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

Status Board is a fork of [Atlasboard](https://atlasboard.bitbucket.io) dashboard framework written in nodejs.

The last real update was over a year ago it seems development has went stale for the project.

I decided to fork it and release it under another name, and continue to improve it.

# Installation

```
npm install status-board
```

This is specially useful during development so you only bring up the components you need.

## Running your wallboard using Atlasboard as a module

From your wallboard directory, assuming that you have ``start.js`` run:

```
npm start
```

``start.js`` looks like this and it is included in > 1.0:

```
const statusBoard = require('status-board').default;

statusBoard(
  {
    port: process.env.ATLASBOARD_PORT || 3000,
    install: false
  },
  function (err) {
    if (err) {
      throw err;
    }
  }
);
```

You'll need to add the Status Board dependency to your ``package.json``.

## Packages and resources

# Documentation

## Migrating from Atlasboard

Nothing is supposed to break once you upgrade but you may want to update a few things:

## Module Long Term Support Policy

This module adopts the [Module Long Term Support (LTS)](http://github.com/CloudNativeJS/ModuleLTS) policy, with the following End Of Life (EOL) dates:

| Module Version   | Release Date | Minimum EOL | EOL With     | Status  |
|------------------|--------------|-------------|--------------|---------|
| 1.x.x	           | Nov 2017     | Apr 2019    | Node.js 6.x  | Current |

Learn more about our LTS plan in [docs](https://github.com/jameswlane/status-board/blob/master/docs/LTS.md).

## Roadmap
Learn more about our reoadmap plan in [docs](https://github.com/jameswlane/status-board/blob/master/docs/ROADMAP.md).

### Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][homepage]

[homepage]: https://saucelabs.com

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/794161?v=4" width="100px;" alt="James W. Lane III"/><br /><sub><b>James W. Lane III</b></sub>](http://fueledbydreams.com)<br />[💻](https://github.com/jameswlane/status-board/commits?author=jameswlane "Code") [⚠️](https://github.com/jameswlane/status-board/commits?author=jameswlane "Tests") [🚇](#infra-jameswlane "Infrastructure (Hosting, Build-Tools, etc)") [🔧](#tool-jameswlane "Tools") | [<img src="https://avatars2.githubusercontent.com/u/6710107?v=4" width="100px;" alt="Swami Kalagiri"/><br /><sub><b>Swami Kalagiri</b></sub>](https://www.linkedin.com/in/swami-kalagiri)<br />[💻](https://github.com/jameswlane/status-board/commits?author=SwamiKalagiri "Code") [⚠️](https://github.com/jameswlane/status-board/commits?author=SwamiKalagiri "Tests") |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

