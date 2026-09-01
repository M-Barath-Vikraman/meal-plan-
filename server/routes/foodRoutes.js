import { Router } from 'express';
import { getFoods, createFood, updateFood, deleteFood } from '../controllers/foodController.js';

const router = Router();

/**
 * Food routes placeholder.
 * Future AWS Integration: DynamoDB 'smartmeal-foods' table.
 */
router.get('/', getFoods);
router.post('/', createFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;
