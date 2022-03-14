import { Router } from 'express';
import {
	populateDatabase,
	searchByTime,
	searchByRestaurantOrDishName,
	searchByMenuPriceRange,
} from '../controllers/restaurant.controller';

const router = Router();

router.post('/api/restaurant/populate', populateDatabase);

router.post('/api/restaurant/search/isOpen', searchByTime);

router.post('/api/restaurant/search/restaurantOrDish', searchByRestaurantOrDishName);

router.post('/api/restaurant/search/priceRange', searchByMenuPriceRange);

export default router;
