import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import expressValidation from 'express-validation';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import httpStatus from 'http-status';
import methodOverride from 'method-override';
import logger from 'morgan';
import APIError from '../src/helpers/APIError';
import routes from '../src/routes/indexRoute';
import config from './config';
import winstonInstance from './winston';

const app = express();
app.set('trust proxy', 1) // trust first proxy

if (config.env === 'development') {
	app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb+srv://siva:siva12345@cluster0.vgpcc.mongodb.net/sampleDB?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// enable detailed API logging in dev env
if (config.env === 'development') {
	expressWinston.requestWhitelist.push('body');
	expressWinston.responseWhitelist.push('body');
	app.use(expressWinston.logger({
		winstonInstance,
		meta: true, // optional: log meta data about request (defaults to true)
		msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
		colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
	}));
}

app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
	if (err instanceof expressValidation.ValidationError) {
		// validation error contains errors which is an array of error each containing message[]
		const unifiedErrorMessage = err.errors
			.map(error => error.messages.join('. '))
			.join(' and ');
		const error = new APIError(unifiedErrorMessage, err.status, true);
		return next(error);
	} else if (!(err instanceof APIError)) {
		const apiError = new APIError(err.message, err.status, err.isPublic);
		return next(apiError);
	}
	return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new APIError('API not found', httpStatus.NOT_FOUND);
	return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
	app.use(expressWinston.errorLogger({
		winstonInstance,
	}));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
	return res.status(err.status).json({
		success: false,
		message: err.isPublic ? err.message : httpStatus[err.status],
		stack: config.env === 'development' ? err.stack : {},
	})
});

export default app;
