import { Router } from 'express';
import { purchaseDish } from '../controllers/user.controller';

const router = Router();

router.put('/api/user/purchaseDish/:userId', purchaseDish);

export default router;
