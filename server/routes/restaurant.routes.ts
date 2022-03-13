import { Router } from 'express';
import { populateDatabase, searchByTime } from '../controllers/restaurant.controller';

const router = Router();

router.post('/api/restaurant/populate', populateDatabase);

router.post('/api/restaurant/search/isOpen', searchByTime);

export default router;
