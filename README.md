# TutePlanning
VueJs web app for planning poker. A deployed demo is available at http://www.tuteplanning.com

 ## Features
 Using Firebase Realtime Database, with [npm firebase](https://www.npmjs.com/package/firebase) the software is listeneing for changes an reflects these changes in the web page.
 Create Sprints, select card types (fibonacci, TShirts) check if only creator can show votes. In each sprint you can add stories, change story to vote, and export results in csv format. 

## Project Setup
You need to create a firebase Realtime database, and create a web app project. copy values from configuration inside a new .env.local file. (If you want to deploy yor project you need a .env.production file).

```
VITE_APP_TITLE=Tute Planning
VITE_HOST_NAME=http://localhost:5173
VITE_FIREBASE_API_KEY=API_KEY
VITE_FIREBASE_AUTH_DOMAIN=AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL=DATABASE_URL
VITE_FIREBASE_PROJECT_ID=PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=SENDER_ID
VITE_FIREBASE_APP_ID=APP_ID
VITE_FIREBASE_MEASUREMENT_ID=EMEASUREMENT_ID
```
  

```sh

npm install

```

  

### Compile and Hot-Reload for Development

  

```sh

npm run dev

```

  

### Compile and Minify for Production

```sh

npm run build

```

### Run Unit Tests with [Vitest](https://vitest.dev/)  

```sh

npm run test:unit

```


### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh

npm run test:e2e:dev

```

This runs the end-to-end tests against the Vite development server.

It is much faster than the production build.
  

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):
  

```sh

npm run build

npm run test:e2e

```

  

### Lint with [ESLint](https://eslint.org/)

  

```sh

npm run lint

```