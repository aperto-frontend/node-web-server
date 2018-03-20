const debug = require('debug');

/**
 * Route debugger with custom namespace.
 *
 * This is our first custom middleware which is responsible to provide debug functionality to your route modules.
 * It expects a namespace like 'modules:myCustomModule' which you can use to filter your debug logs.
 *
 * Usage:
 * DEBUG=modules:myCustomModule,express:application npm run start
 *
 */
module.exports = function routeDebugger(namespace) {
	const moduleDebugger = debug(namespace);

	/**
	 * This is my generic middleware to handle the route.
	 * We use `next()` to go to the next route handler.
	 */
	return (req, res, next) => {
		// Debug for now method and url, later we improve that...
		moduleDebugger(req.method, req.url);

		next();
	};
};