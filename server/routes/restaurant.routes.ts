import { Router } from 'express';
import { populateDatabase } from '../controllers/restaurant.controller';

const router = Router();

router.post('/api/restaurant/populate', populateDatabase);

export default router;
