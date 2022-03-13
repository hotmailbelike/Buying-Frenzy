import { model, Schema } from 'mongoose';

const menuSubSchema: Schema = new Schema({
	dishName: {
		type: String,
	},
	price: {
		type: Number,
	},
});

const timeScheduleSubSchema: Schema = new Schema({
	day: {
		type: String,
	},
	start: {
		type: Number, // 24 hour clock time in minutes
	},
	end: {
		type: Number, // 24 hour clock time in minutes
	},
});

const restaurantSchema: Schema = new Schema(
	{
		cashBalance: {
			type: Number,
		},
		menu: [menuSubSchema],
		timeSchedule: [timeScheduleSubSchema],
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
