import { Request, Response } from 'express';
import User from '../models/user.model';
import Restaurant from '../models/restaurant.model';
import mongoose from 'mongoose';

interface MenuItem {
	_id: string;
	dishName: string;
	price: number;
}

const purchaseDish = async (req: Request, res: Response) => {
	let { restaurantId, dishName }: { restaurantId: string; dishName: string } = req.body;
	let { userId } = req.params; // NOTE: this must be mongodb _id

	const session = await mongoose.startSession();

	try {
		session.startTransaction({
			readPreference: 'primary',
			readConcern: { level: 'local' },
			writeConcern: { w: 'majority' },
		});

		const userQuery = User.findById(userId).session(session);
		const restaurantQuery = Restaurant.findById(restaurantId)
			.session(session)
			.select('-timeSchedule');
		const [user, restaurant] = await Promise.all([userQuery, restaurantQuery]);

		let dish: MenuItem = restaurant.menu.find(
			(menuItem: MenuItem) => menuItem.dishName === dishName
		);

		if (user.cashBalance >= dish.price) {
			user.cashBalance -= dish.price;
			user.purchaseHistory.push({
				dishName: dish.dishName,
				restaurantName: restaurant.restaurantName,
				transactionAmount: dish.price,
			});
			restaurant.cashBalance += dish.price;

			await user.save({ session });
			await restaurant.save({ session });
		} else {
			await session.abortTransaction();
			session.endSession();
			return res.status(487).json({ msg: 'Insufficient balance to purchase this dish' });
		}

		await session.commitTransaction();
		session.endSession();

		res.json({ user, restaurant });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error('purchaseDish -> error', error);
		return res.status(500).json({ error });
	}
};

export { purchaseDish };
