import { model, Schema } from 'mongoose';

const purchaseHistorySubSchema: Schema = new Schema({
	dishName: {
		type: String,
		required: true,
	},
	restaurantName: {
		type: String,
		required: true,
	},
	transactionAmount: {
		type: Number,
		required: true,
	},
	transactionDate: {
		type: Date,
		required: true,
	},
});

const userSchema: Schema = new Schema(
	{
		cashBalance: {
			type: Number,
			required: true,
		},
		id: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
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
