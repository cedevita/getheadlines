# Get Headlines App

Automates XML/RSS feed parsing into JSON and exposes data via REST API

## How does it work

1. Gets feed provider URL from Firebase database
2. Fetches data from URL
3. Parses it into JSON object
4. Saves optimized data to Firebase
5. Dynamically exposes API routes for all providers

## Installation
Download project to your local directory and install dependencies.
```
$ git clone git@github.com:cedevita/getheadlines.git
```
```
$ yarn install
```

### Firebase
Add the Firebase Admin SDK to Your Server [link](https://firebase.google.com/docs/admin/setup)
After you download your `serviceAccountKey.json` place it inside `/scripts/firebase/`,
and require it inside `/scripts/firebase/config.js`.

## Usage / Running Locally
Nodemon is used to wrap application, listen to changes and automatically restart server.
```
$ yarn start
```
Check out `package.json` for more available commands.

### APIs
Use [Postman](https://www.getpostman.com/) or similar tool to play with routes. Example: `GET http://localhost/api/providers/`
