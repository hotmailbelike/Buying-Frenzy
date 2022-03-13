import moment from 'moment';

const convertTimeToMinutes = (timeStr: string) => {
	timeStr = moment(timeStr, ['h:mm A']).format('HH:mm');
	let timeStrArray: string[] = timeStr.split(':');
	let minutes: number = parseInt(timeStrArray[0]) * 60 + parseInt(timeStrArray[1]);
	return minutes;
};

const breakDownStringDate = (restaurantData: any[]) => {
	restaurantData.forEach((restaurant) => {
		let timeSchedule: any[] = [];

		let times = restaurant.openingHours.split(' / ');
		// console.log('times length', times.length);
		// while (times.length < 7) {
		times.forEach((timeStr: string) => {
			let days: string[] = [];
			let start: string = '';
			let end: string = '';
			timeStr = timeStr.replace(/ /g, ''); // get rid of all white spaces to make it easier to check
			let timeStrArraySplitByHyphen: string[] = timeStr.split('-'); // the 1th index of the result will contain the end time
			end = timeStrArraySplitByHyphen[1];
			timeStr = timeStrArraySplitByHyphen[0]; // set string to 0th index to start next processing
			let timeStrArraySplitByComma: string[] = timeStr.split(','); // splitting by "," will help check if there are multiple days

			if (timeStrArraySplitByComma.length > 1) {
				// this means that there are multiple days
				// push all values except all one since this one contains day mixed with time
				for (let i = 0; i < timeStrArraySplitByComma.length - 1; i++) {
					const day = timeStrArraySplitByComma[i];
					days.push(day);
				}
			}
			// set last index of timeStr array as timeStr
			timeStr = timeStrArraySplitByComma[timeStrArraySplitByComma.length - 1];

			// loop through the timeStr string and look for a number.
			// from the index of found number to end of the array represents start time
			// from the start of the array to index of found number represents a day
			for (let i = 0; i < timeStr.length; i++) {
				const timeChar = timeStr[i];
				if (!!parseInt(timeChar)) {
					days.push(timeStr.substring(0, i));
					start = timeStr.substring(i, timeStr.length);
					break;
				}
			}

			days.forEach((day) => {
				timeSchedule.push({
					day,
					start: convertTimeToMinutes(start),
					end: convertTimeToMinutes(end),
				});
			});
			restaurant.timeSchedule = timeSchedule;
			restaurant.openingHours = undefined;
		});
	});
	return restaurantData;
};

export { breakDownStringDate, convertTimeToMinutes };
