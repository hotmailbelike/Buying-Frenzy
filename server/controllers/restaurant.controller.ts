import { Request, Response } from 'express';
import Restaurant from '../models/restaurant.model';
import User from '../models/user.model';

import restaurantSampleData from '../sampleData/restaurant_with_menu.json';
import userSampleData from '../sampleData/users_with_purchase_history.json';
import { breakDownStringDate, convertTimeToMinutes } from '../utils/processSampleData';

const populateDatabase = async (req: Request, res: Response) => {
	try {
		// need to update break openingHours value to {day, start, end}
		// e.g: {day:"Mon", start:660, end:900}
		let restaurantSampleDataCopy: any[] = [...restaurantSampleData];

		restaurantSampleDataCopy = breakDownStringDate(restaurantSampleDataCopy);

		await Restaurant.insertMany(restaurantSampleDataCopy, { ordered: false });
		await User.insertMany(userSampleData, { ordered: false });
		return res.status(200).json({ msg: 'Database populated!' });
	} catch (error) {
		console.log('populateDatabase -> error', error);

		return res.status(500).json({ error });
	}
};

/* 
	timeString in reqest body must follow the format: "DDD HH:MM am/pm" e.g "Mon 12:30 pm"
*/
const searchByTime = async (req: Request, res: Response) => {
	const page: number = (req.query as any).page ? parseInt((req.query as any).page) : 0;
	const limit: number = (req.query as any).limit ? parseInt((req.query as any).limit) : 0;

	let { timeString } = req.body;

	try {
		let day: string = '';
		let timeIn12Hour: string = '';

		let timeStringSplitBySpaceArray: string[] = timeString.split(' ');
		day = timeStringSplitBySpaceArray[0];
		timeIn12Hour = `${timeStringSplitBySpaceArray[1]}${timeStringSplitBySpaceArray[2]}`;
		let timeInMinutes: number = convertTimeToMinutes(timeIn12Hour);
		console.log(
			'🚀 -> file: restaurant.controller.ts -> line 44 -> searchByTime -> timeInMinutes',
			timeInMinutes
		);
		console.log(
			'🚀 -> file: restaurant.controller.ts -> line 42 -> searchByTime -> day',
			day
		);

		const restaurants = await Restaurant.find({
			timeSchedule: {
				$elemMatch: { day, start: { $lte: timeInMinutes }, end: { $gte: timeInMinutes } },
			},
		})
			.skip(page * limit)
			.limit(limit);

		res.json(restaurants);
	} catch (error) {
		console.error('searchByTime -> error', error);
		return res.status(500).json({ error });
	}
};

export { populateDatabase, searchByTime };
