/**
 * Libs
 */
const express = require('express');

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
 * Custom modules
 *
 * With custom modules we split up our application into multiple mini apps.
 *
 * These modules get assigned to an entry point (like `/users`) and
 * handle the request on its own.
 */
app.use('/users', moduleDebugger('modules:users'), usersModule);


/**
 * Default route
 */
app.get('/', (req, res) => {
	res
		.status(200) // In general that is not necessary, when you send something back, but at least you see how to chain `status()` with `send()`
		.json({
			test: 'test'
		});
});

console.info(`Express server started on port ${app.get('port')}!`);

/**
 * Listen to the port
 */
app.listen(app.get('port'));