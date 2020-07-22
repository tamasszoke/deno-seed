# <img src="https://i.ibb.co/2KtgqCv/New-Project-4-1.png" width="500" />

![CI](https://github.com/tamasszoke/deno-seed/workflows/CI/badge.svg)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/tamasszoke/deno-seed)
[![deno version](https://img.shields.io/badge/deno-^1.2.0-informational?logo=deno)](https://github.com/denoland/deno)

Boilerplate for deno development. Mongo, Oak, React, Deno (MORD stack).

[Support the project](https://ko-fi.com/Z8Z7XSML)

### Highlights

+ [Docker](https://www.docker.com/) containers
+ [Redis](https://www.npmjs.com/package/connect-redis) for sessions
+ Folder by Feature structure
+ Minimal [Material UI v4](https://material-ui.com/) design
+ Built-in dark theme switch
+ Built-in React routing, [Redux](https://redux.js.org/)
+ Built-in local authentication
+ Handling database with [deno_mongo](https://github.com/manyuanrong/deno_mongo)
+ Email sending by [deno-smtp](https://github.com/manyuanrong/deno-smtp)
+ Using [std log](https://github.com/denoland/deno/tree/master/std/log) for logging
+ Testing with the [built-in test runner](https://deno.land/manual/testing)
+ Clean code with the [built-in formatter](https://deno.land/manual/tools/formatter)
+ [Deno bundler](https://deno.land/manual/tools/bundler) support

# Table of contents

- [Table of contents](#table-of-contents)
- [Roadmap](#roadmap)
- [Installation](#installation)
    - [Clone the repository](#clone-the-repository)
    - [Install dependencies - Frontend](#install-dependencies---frontend)
    - [Set env variables - Frontend](#set-env-variables---frontend)
    - [Set env variables - Backend](#set-env-variables---backend)
    - [Create database - Backend](#create-database---backend)
- [Usage](#usage)
  - [Basic](#basic)
  - [Docker commands](#docker-commands)
  - [Without docker](#without-docker)
- [Details](#details)
- [Dependencies](#dependencies)
- [License](#license)

# Roadmap

These are the planned updates of the project.

- Rhum testing
- SSL support
- Websocket support
- Google login
- PayPal payment
- Email templates

Since the deno and it's modules are not stable yet, breaking changes could happen to this project!

# Installation

1. Clone the repository
2. Install dependencies (frontend)
3. Set env variables
4. Create database

#### Clone the repository

`git clone https://github.com/tamasszoke/deno-seed.git`

#### Install dependencies - Frontend

Run <code>npm install</code> at the frontend folder

#### Set env variables - Frontend

Create <code>.env.development</code> and <code>.env.production</code> files inside <code>frontend/</code> folder.

Use port `3002` for development and port `80` for production.

Example (include all of these):

    HOST=0.0.0.0
    PORT=3002
    REACT_APP_PROTOCOL=http
    REACT_APP_HOST=localhost
    REACT_APP_PORT=5000
    SKIP_PREFLIGHT_CHECK=true
    CHOKIDAR_USEPOLLING=true

Located at `frontend/.env.development`.

Note: if you change the ports change them in the dockerfiles too (root, backend).

#### Set env variables - Backend

Create <code>.env.test</code>, <code>.env.development</code> and <code>.env.production</code> files inside <code>backend/.env/</code> folder.

Use port `5000` for test, development and port `80` for production.

Example (include all of these):

    APP_NAME=Deno Seed
    IP=0.0.0.0
    HOST=localhost
    PORT=5000
    PROTOCOL=http
    CLIENT_PROTOCOL=http
    CLIENT_HOST=localhost
    CLIENT_PORT=3002
    REDIS_HOST=redis
    REDIS_PORT=6379
    DB_HOST=[MLAB_DB_URL]
    DB_NAME=[MLAB_BD_NAME]
    DB_USER=[MLAB_DB_USERNAME]
    DB_PASS=[MLAB_DB_PASSWORD]
    EMAIL_ADDRESS=[GMAIL_ADDRESS]
    EMAIL_PASS=[GMAIL_PASSWORD]

Located at `backend/.env/.env.development`.

Note: if you change the ports change them in the dockerfiles too (root, backend).

#### Create database - Backend

Create MongoDB with a collection called `users`.

I've used the free service provided by [mLab](https://mlab.com/).

# Usage

Note: use the following commands at the root folder.

### Basic

#### Development

1. Start <code>docker-compose -f docker-compose.development.yml up</code>
2. Go to <code>http://localhost:5000</code> in browser for server
3. Go to <code>http://localhost:3002</code> in browser for client

#### Production

1. Run <code>sh build.sh</code>
1. Start <code>docker-compose -f docker-compose.production.yml up -d</code>
2. Go to <code>http://localhost:80</code> in browser

Note: run `npm rebuild node-sass` inside the client container if asked.

### Docker commands

Using separated docker-compose files for development and production.

#### Development

Start: `docker-compose -f docker-compose.development.yml up`<br>
Stop: `docker-compose -f docker-compose.development.yml down`

#### Production

Start: `docker-compose -f docker-compose.production.yml up`<br>
Stop: `docker-compose -f docker-compose.production.yml down`

### Without docker

Note: don't forget to start your redis server or it will fallback to use the memory for the sessions.

#### Development

1. Start <code>sh dev.sh</code> at the root folder (or manually start the denon scripts)
2. Go to <code>http://localhost:5000</code> (backend)
3. Go to <code>http://localhost:3002</code> (frontend)

#### Production

1. Run <code>sh build.sh</code> at the root folder
2. Run <code>denon prod</code> at the build folder
3. Go to <code>http://localhost:80</code>

Note: you may need to install [Denon](https://github.com/denosaurs/denon/).

# Details

#### Format

Using typescript `.ts` files and the built-in [formatter](https://deno.land/std/fmt) for deno.

#### Test

Using the built-in [testing](https://deno.land/std/testing) library and [Superoak]() with integration tests only, because of the higher ROI. The integration tests will cover the basic functions of the application, you can find them in the `backend/app.test.ts`.

#### Configuration

Using `.env` files to set up the basics with the [dotenv](https://deno.land/x/dotenv) third party module.
The main variable is the ENV which can be development or production.
This will search for the correct env file to use in the `backend/src/config/services/settings.ts`, defaults to test.

#### Framework

The middleware framework is the [Oak](https://deno.land/x/oak) library along with the [Cors](https://deno.land/x/cors/mod.ts) module to avoid CORS problems.

#### Sessions

The session handled by the third party module, [Session](https://deno.land/x/session), it adds a middleware to the application, so we can get the session variables from any route by using `context.session`.

#### Database

The database is MongoDB using the [Mongo](https://deno.land/x/mongo) (deno_mongo) module. Created a reusable class which is connecting to the database only once, and using that connection for the future queries. Validating the user schema with the [Validasaur](https://deno.land/x/validasaur) module.

#### Logging

Using the built-in [logger](https://deno.land/std/log), created two main types, the default and the test, which is only logging critical levels, to hide debug logs during the tests.

#### Authorization

The passwords are hashed with salt (different for every user), using the [Bcrypt](https://deno.land/x/bcrypt) library.

#### Routing

The routing is in the following format: api/service/type/action
For example, to login, use: api/auth/local/login

#### Script runner

Using [Denon](https://deno.land/x/denon/), the scripts are `format`, `test`, `start`, `prod`.

# Dependencies

#### Backend

| Name        | Version |
| :---------- |:--------|
| oak| main branch |
| bcrypt| 0.2.3 |
| mongo| 0.9.1 |
| log| 0.61.0 |
| session| master branch |
| dotenv| master branch |
| validasaur| 0.9.4 |
| deno-smtp| tamasszoke fork |
| cors| master branch |
| superoak| 2.0.0 |

Unfortunately some packages are not refreshing their releases actively (or not published any), so I had to use the master branch of them.

#### Frontend

| Name        | Version |
| :---------- |:--------|
| @material-ui/core| ^4.4.2 |
| @material-ui/icons| ^4.4.1 |
| @material-ui/styles| ^4.4.1 |
| animate.css| ^3.7.2 |
| axios| ^0.19.0 |
| node-sass| ^4.12.0 |
| react| ^16.9.0 |
| react-dom| ^16.9.0 |
| react-material-ui-form-validator| ^2.0.9 |
| react-notifications-component| ^2.0.7 |
| react-redux| ^7.1.1 |
| react-router-dom| ^5.0.1 |
| react-scripts| 3.1.1 |
| redux| ^4.0.4 |
| redux-persist| ^6.0.0 |

# License

**The MIT License (MIT)**<br/>
Copyright (c) 2020 Tamas Szoke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)
