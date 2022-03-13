import { Request, Response } from 'express';
import Restaurant from '../models/restaurant.model';
import User from '../models/user.model';

import restaurantSampleData from '../sampleData/restaurant_with_menu.json';
import userSampleData from '../sampleData/users_with_purchase_history.json';
import { breakDownStringDate } from '../utils/processSampleData';

interface LooseObject {
	[key: string]: any;
}

interface RestaurantData {
	cashBalance: number;
	menu: {
		dishName: string;
		price: number;
	}[];
	openingHours: {
		day: string;
		start: number;
		end: number;
	}[];
	restaurantName: string;
}

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
		console.error(
			'🚀 -> file: restaurant.controller.ts -> line 15 -> populateDatabase -> error',
			JSON.stringify(error, null, 2)
		);
		return res.status(500).json({ error });
	}
};

export { populateDatabase };
