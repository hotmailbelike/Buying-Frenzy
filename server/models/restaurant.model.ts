import { model, Schema } from 'mongoose';

const menuSubSchema: Schema = new Schema({
	dishName: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const restaurantSchema: Schema = new Schema(
	{
		cashBalance: {
			type: Number,
			required: true,
		},
		menu: [menuSubSchema],
		openingHours: {
			type: String,
			required: true,
		},
		restaurantName: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const restaurant = model('restaurant', restaurantSchema);

export default restaurant;
