# Project Installation 
 
- After clonning the repo, install the dependencies by running command 
	```npm i ```

- In project root directory copy .env.example and make a new file .evn. Update the keys with proper environment values/ 
		API_URL which our app uses to interact with apis.  

- Run the project in development mode by running command
	``` npm start ```


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


### Page refresh issue fix

create the .htaccess file in the web root(build) with following:

```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```