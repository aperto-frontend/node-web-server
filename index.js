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
app.use(express.static(`${__dirname}/statics`)); // __dirname is a NodeJS var which you can access directly. It contains the path to this file.

/**
 * Configure view engine
 */
const handlebars = hbs.handlebars;


// Partials
hbs.registerPartials(`${__dirname}/server/views/layouts`);
hbs.registerPartials(`${__dirname}/server/views/partials`);

// Helpers
require('handlebars-helpers')({
	handlebars: handlebars
});
layouts.register(handlebars);
mangonyHelpers.register(handlebars);

// Set view engine
app.set('view engine', 'hbs');
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
 * Default route
 */
app.get('/', (req, res) => {
	res.redirect('/home');
});

app.get('/:id', (req, res) => {
	const {id} = req.params;
	const data = fs.readFileSync(`${__dirname}/server/views/pages/${id}/${id}.json`, 'utf-8');
	res.locals = JSON.parse(data);

	res.render(`${id}/${id}`);
});

console.info(`Express server started on port ${app.get('port')}!`);

/**
 * Listen to the port
 */
app.listen(app.get('port'));