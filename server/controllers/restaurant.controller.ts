import 'isomorphic-fetch';
import { Request, Response } from 'express';
import Restaurant from '../models/restaurant.model';
import User from '../models/user.model';
import { breakDownStringDate, convertTimeToMinutes } from '../utils/processSampleData';

const populateDatabase = async (req: Request, res: Response) => {
	try {
		const getRestaurantSampleData = fetch(
			'https://gist.githubusercontent.com/seahyc/b9ebbe264f8633a1bf167cc6a90d4b57/raw/021d2e0d2c56217bad524119d1c31419b2938505/restaurant_with_menu.json'
		).then((res) => res.json());
		const getUserSampleData = fetch(
			'https://gist.githubusercontent.com/seahyc/de33162db680c3d595e955752178d57d/raw/785007bc91c543f847b87d705499e86e16961379/users_with_purchase_history.json'
		).then((res) => res.json());

		let [restaurantSampleData, userSampleData] = await Promise.all([
			getRestaurantSampleData,
			getUserSampleData,
		]);

		// need to update break openingHours value to {day, start, end}
		// e.g: {day:"Mon", start:660, end:900}

		(restaurantSampleData as any) = breakDownStringDate(restaurantSampleData as any);

		await Restaurant.insertMany(restaurantSampleData, { ordered: false });
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

const searchByRestaurantOrDishName = async (req: Request, res: Response) => {
	try {
		let { restaurantOrDishName } = req.body;

		let regexSearchTerm: RegExp = new RegExp(restaurantOrDishName, 'i');

		let restaurantQuery = Restaurant.find({
			$or: [{ restaurantName: { $regex: regexSearchTerm } }],
		});

		let dishQuery = Restaurant.aggregate([
			{ $unwind: '$menu' },
			{ $match: { 'menu.dishName': { $regex: regexSearchTerm } } },
			{
				$project: {
					_id: 0,
					restaurantName: 1,
					dishName: '$menu.dishName',
					price: '$menu.price',
				},
			},
		]);

		const [restaurants, dishes] = await Promise.all([restaurantQuery, dishQuery]);

		if (restaurants.length > dishes.length) {
			res.json({ restaurants, dishes });
		} else if (dishes.length > restaurants.length) {
			res.json({ dishes, restaurants });
		}
	} catch (error) {
		console.error('searchByRestaurantNameOrDish -> error', error);
		return res.status(500).json({ error });
	}
};

export { populateDatabase, searchByTime, searchByRestaurantOrDishName };
