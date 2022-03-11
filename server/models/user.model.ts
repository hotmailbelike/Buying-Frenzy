import { model, Schema } from 'mongoose';

const purchaseHistorySubSchema: Schema = new Schema({
	dishName: {
		type: String,
	},
	restaurantName: {
		type: String,
	},
	transactionAmount: {
		type: Number,
	},
	transactionDate: {
		type: Date,
	},
});

const userSchema: Schema = new Schema(
	{
		cashBalance: {
			type: Number,
		},
		id: {
			type: Number,
		},
		name: {
			type: String,
		},
		purchaseHistory: {
			type: [purchaseHistorySubSchema],
		},
	},
	{
		timestamps: true,
	}
);

const user = model('user', userSchema);

export default user;
