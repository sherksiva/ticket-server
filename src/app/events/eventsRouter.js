import express from 'express';
import EventsController from './eventsController';

const router = express.Router();
const ctrl = new EventsController();

/**
 *  GET /v1/events 
 */
router.route('/events').get(ctrl.getEvents);
/**
 *  PUT /v1/events 
 */
router.route('/events').put(ctrl.updateEvents);

router.route('/events').post(ctrl.insertEvents);

export default router;
