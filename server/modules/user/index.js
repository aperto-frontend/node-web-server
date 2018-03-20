const express = require('express');

/**
 * Here we create a mini-app which is responsible to handle the requests.
 *
 * In general all callback functions should be controllers and saved in its own file.
 */
const router = express.Router();

/**
 * Display all users
 */
router.get('/', (req, res) => {
	res.send(`
<ul>
	<li>Lisa Martin</li>
	<li>Anne Watweisick</li>
	<li>Sinatra</li>
</ul>
	`)
});

/**
 * Use a param in there which we can access in req.params
 */
router.get('/:id', (req, res) => {
	res.send(`
<ul>
	<li>Lisa Martin</li>
</ul>
	`);
});

module.exports = router;