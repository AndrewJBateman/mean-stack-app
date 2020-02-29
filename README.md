# Mean Full Stack App

Mongo Express Angular Node (MEAN) full-stack app, integrates Angular 9 frontend with Node.js backend.

*** Note: to open web links in a new window use: _ctrl+click on link_**

## Table of contents

* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info

* requires mongodb to be running (or use Mongoose and heroku mLab to access).
* The tutorial was for Angular 4 but the latest version of Angular 9 is used.

## Screenshots

![Example screenshot](./img/.png)

## Technologies

* [MongoDB Community Server v4.0.9](https://www.mongodb.com/download-center/community)
* [npm mongodb v3.5.4](https://www.npmjs.com/package/mongodb) official MongoDB driver for Node.js
* [Express.js middleware v4.17.1](https://expressjs.com/)
* [Angular framework v9.1.0](https://angular.io/)
* [Node.js v12.4.0](https://nodejs.org/es/)
* [npm bodyparser middleware v1.19.0](https://www.npmjs.com/package/body-parser) to parse incoming request bodies.

## Setup

* Install dependencies using `npm i`
* Run `ng serve` for a dev server.
* Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Code Examples

* server/api.js express routing get request for users

```javascript
// Get all users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
```

## Features

* updated to use latest Angular v9

## Status & To-Do List

* Status: working Angular 9 frontend. Backend end needs more work.
* To-Do: remove reference to Mongoose, remove routing module, fix backend code and test. Create dist file.

## Inspiration

* [Coursetro: Setting up a MEAN4+ App (MongoDB, Express.js, Nodejs, Angular)](https://www.youtube.com/watch?v=Tw-rskOmcMM)
* [Coursetro Gary Simon written tutorial for the above video](https://coursetro.com/posts/code/84/Setting-up-an-Angular-4-MEAN-Stack-(Tutorial))

## Contact

Repo created by [ABateman](https://www.andrewbateman.org) - feel free to contact me!
