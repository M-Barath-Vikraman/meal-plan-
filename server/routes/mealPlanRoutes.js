import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getPlanByDate,
  createPlanItem,
  togglePlanItemCompletion,
  deletePlanItem,
} from '../controllers/mealPlanController.js';

const router = Router();

// Protect all meal plan routes with authentication middleware
router.use(requireAuth);

router.get('/', getPlanByDate);
router.post('/', createPlanItem);
router.patch('/:id/complete', togglePlanItemCompletion);
router.delete('/:id', deletePlanItem);

export default router;
