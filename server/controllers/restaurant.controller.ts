import { Request, Response } from 'express';
import Restaurant from '../models/restaurant.model';
import User from '../models/user.model';

import restaurantSampleData from '../sampleData/restaurant_with_menu.json';
import userSampleData from '../sampleData/users_with_purchase_history.json';

const populateDatabase = async (req: Request, res: Response) => {
	try {
		await Restaurant.insertMany(restaurantSampleData);
		await User.insertMany(userSampleData);
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
