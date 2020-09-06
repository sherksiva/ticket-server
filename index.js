import 'babel-polyfill';
import config from './config/config';
import app from './config/express';

// make bluebird default Promise
Promise = require('bluebird');

// module.parent check is required to support mocha watch
if (!module.parent) {
	// listen on port config.port
	app.listen(config.port, () => {
		console.info(`server started on port ${config.port} (${config.env})`);
	});
}

export default app;
