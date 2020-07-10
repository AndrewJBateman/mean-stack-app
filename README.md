# :zap: Mean Full Stack App

Mongo Express Angular Node (MEAN) full-stack app, integrates Angular 10 frontend with Node.js backend.

*** Note: to open web links in a new window use: _ctrl+click on link_**

## :page_facing_up: Table of contents

* [:zap: Mean Full Stack App](#zap-mean-full-stack-app)
  * [:page_facing_up: Table of contents](#page_facing_up-table-of-contents)
  * [:books: General info](#books-general-info)
  * [:camera: Screenshots](#camera-screenshots)
  * [:signal_strength: Technologies](#signal_strength-technologies)
  * [:floppy_disk: Setup](#floppy_disk-setup)
  * [:computer: Code Examples](#computer-code-examples)
  * [:cool: Features](#cool-features)
  * [:clipboard: Status & To-Do List](#clipboard-status--to-do-list)
  * [:clap: Inspiration](#clap-inspiration)
  * [:envelope: Contact](#envelope-contact)

## :books: General info

* requires mongodb to be running (or use Mongoose and heroku mLab to access).
* The tutorial was for Angular 4 the app has been updated to Angular 10.

## :camera: Screenshots

![Example screenshot](./img/.png)

## :signal_strength: Technologies

* [MongoDB Community Server v4](https://www.mongodb.com/download-center/community)
* [npm mongodb v3](https://www.npmjs.com/package/mongodb) official MongoDB driver for Node.js
* [Express.js middleware v4](https://expressjs.com/)
* [Angular framework v10](https://angular.io/)
* [Node.js v12](https://nodejs.org/es/)
* [npm bodyparser middleware v1](https://www.npmjs.com/package/body-parser) to parse incoming request bodies.

## :floppy_disk: Setup

* Install dependencies using `npm i`
* Run `ng serve` for a dev server.
* Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## :computer: Code Examples

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

## :cool: Features

* updated to use latest Angular v10

## :clipboard: Status & To-Do List

* Status: working Angular 10 frontend. Backend end needs more work.
* To-Do: remove reference to Mongoose, remove routing module, fix backend code and test.

## :clap: Inspiration

* [Coursetro: Setting up a MEAN4+ App (MongoDB, Express.js, Nodejs, Angular)](https://www.youtube.com/watch?v=Tw-rskOmcMM)
* [Coursetro Gary Simon written tutorial for the above video](https://coursetro.com/posts/code/84/Setting-up-an-Angular-4-MEAN-Stack-(Tutorial))

## :envelope: Contact

Repo created by [ABateman](https://www.andrewbateman.org) - feel free to contact me!
