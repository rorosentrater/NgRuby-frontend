// Guide:
// https://medium.com/@ferie/how-to-pass-environment-variables-at-building-time-in-an-angular-application-using-env-files-4ae1a80383c
// import { writeFile } from 'fs';
const fs = require('fs');
const writeFile = fs.writeFile;

// Configure Angular `environment.ts` file path
// const targetPath = './environment.ts'; // TODO: I think you overwrite prod and then call ng build --prod
const targetPath = './environment.ts';

// Load node modules
const colors = require('colors');
require('dotenv').load();

// `.env` file structure
const envConfigFile = `export const environment = {
  backendEndpoint: '${process.env.BACKEND_ENDPOINT}',
  backendWebsocketEndpoint: '${process.env.BACKEND_WEBSOCKET}',
  production: false
};`;
console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
  }
});
