import { model, Schema } from 'mongoose';

const menuSubSchema: Schema = new Schema({
	dishName: {
		type: String,
	},
	price: {
		type: Number,
	},
});

const restaurantSchema: Schema = new Schema(
	{
		cashBalance: {
			type: Number,
		},
		menu: [menuSubSchema],
		openingHours: {
			type: String,
		},
		restaurantName: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const restaurant = model('restaurant', restaurantSchema);

export default restaurant;
