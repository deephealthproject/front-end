// import { writeFile } from 'fs';
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.prod.ts';
// Load node modules
const colors = require('colors');
require('dotenv').load();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
   apiBaseUrl: '${process.env.API_URL}',
   production: '${process.env.PRODUCTION}',
   clientId: '${process.env.CLIENTID}'
};
`;
console.log(colors.magenta('The file `environment.prod.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));
//const writeFile = require('fs');
const writeFile = require('write-file');
writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.prod.ts file generated correctly at ${targetPath} \n`));
   }
});