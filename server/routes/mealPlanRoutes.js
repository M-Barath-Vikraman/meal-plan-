import { Router } from 'express';
import {
  getPlanByDate,
  createPlanItem,
  togglePlanItemCompletion,
  deletePlanItem,
} from '../controllers/mealPlanController.js';

const router = Router();

/**
 * Meal plan routes placeholder.
 * Future AWS Integration: DynamoDB 'smartmeal-plans' table.
 */
router.get('/', getPlanByDate);
router.post('/', createPlanItem);
router.patch('/:id/complete', togglePlanItemCompletion);
router.delete('/:id', deletePlanItem);

export default router;
