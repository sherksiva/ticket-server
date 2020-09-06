
import httpStatus from 'http-status';
import Event from '../models/events.model';

export default class EventsController {

	/**
	 * get all data from events
	 * @param req
	 * @param res
	 * @param next
	 * @returns {*}
	 */
	async getEvents(req, res, next) {
		try {
			const queryData = req.query.id ? { _id: req.query.id } : {};
			await Event.find(queryData).then(async result => {
				return res.status(httpStatus.OK).json({
					success: true,
					data: result
				});
			}).catch(e => next(e));
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				success: false,
				msg: 'INTERNAL_SERVER_ERROR'
			});
		}
	}

	async insertEvents(req, res, next) {

		console.log(req.body, "Body ")
		try {
			Event.create({ ...req.body }, function (err, data) {
				if (err) {
					return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
						success: false
					});
				}
				return res.status(httpStatus.OK).json({
					success: true,
					data: data
				});
			})
		} catch (err) {
			console.log(err, "err");
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				success: false,
				msg: 'INTERNAL_SERVER_ERROR'
			});
		}
	}

	async updateEvents(req, res, next) {
		console.log(req.body, "requestData")
		const filter = { _id: req.body.id };
		const update = { seats: req.body.seats };

		try {
			console.log(filter, update, "flgjjfkg")
			await Event.findOneAndUpdate(filter, update).then(async result => {
				return res.status(httpStatus.OK).json({
					success: true,
					data: result
				});
			}).catch(e => next(e));
		} catch (err) {
			console.log(err, "err");
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				success: false,
				msg: 'INTERNAL_SERVER_ERROR'
			});
		}
	}
}