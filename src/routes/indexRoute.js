import express from 'express';
import httpStatus from 'http-status';
import eventRouter from '../app/events/eventsRouter';
const router = express.Router();

router.get('/', function (req, res) {
	res.status(httpStatus.OK).send('Hello! The API for Demo Application is at http://localhost:' + 4000);
});

// Event Router
router.use('/', eventRouter);


export default router;
