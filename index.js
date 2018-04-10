/**
 * Libs
 */
const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const layouts = require('handlebars-layouts');
const mangonyHelpers = require('mangony-hbs-helpers');

// Utilities
const moduleDebugger = require('./server/utils/debugger');

/**
 * Modules
 */
const usersModule = require('./server/modules/user');

/**
 * Application
 */
const app = express();

// App variables which we can access in `req` object of routes
app.set('STATUS', 200);
app.set('port', 3000);

/**
 * Generic middleware functions
 */
app.use(express.static(`${__dirname}/statics`)); // __dirname is a NodeJS var which you can access directly. It
                                                 // contains the path to this file.

/**
 * Configure view engine
 */
const handlebars = hbs.handlebars;

// Register Partials
// !IMPORTANT :: Every '-' in the filename gets replaced with '_'
hbs.registerPartials(`${__dirname}/server/views/layouts`); // Layouts are also partials in handlebars
hbs.registerPartials(`${__dirname}/server/views/partials`);

// Helpers
// Register the main helpers library first to make sure other helpers are working to!
require('handlebars-helpers')({
	handlebars: handlebars
});

// Register the layouts helpers (block, extend, content)
layouts.register(handlebars);

// Register mangony helpers (https://github.com/Sebastian-Fitzner/mangony-hbs-helpers)
mangonyHelpers.register(handlebars);

// Set view engine
app.set('view engine', 'hbs');

// Set the pages directory
app.set('views', `${__dirname}/server/views/pages`);

/**
 * Custom modules
 *
 * With custom modules we split up our application into multiple mini apps.
 *
 * These modules get assigned to an entry point (like `/users`) and
 * handle the request on its own.
 */
app.use('/api/users', moduleDebugger('modules:users'), usersModule);

/**
 * Default route redirects to /home
 */
app.get('/', (req, res) => {
	res.redirect('/home');
});

/**
 * Handle pages by using id which is the filename
 */
app.get('/:id', (req, res) => {
	const { id } = req.params; // Spread operator to get the id out of the params
	// Read the file from the filesystem synchronous
	const data = fs.readFileSync(`${__dirname}/server/views/pages/${id}/${id}.json`, 'utf-8');
	// Parse the string to an object and save it to res.locals to access the properties in the templates.
	res.locals = JSON.parse(data);

	// Render the page by using the id for the path (for example: home/home).
	res.render(`${id}/${id}`);
});

console.info(`Express server started on port ${app.get('port')}!`);

/**
 * Listen to the port
 */
app.listen(app.get('port'));