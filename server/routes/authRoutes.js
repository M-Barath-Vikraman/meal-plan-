import { Router } from 'express';
import { getCurrentUser } from '../controllers/authController.js';

const router = Router();

/**
 * Authentication routes placeholder.
 * Future AWS Integration: AWS Cognito User Pools JWT verification.
 */
router.get('/me', getCurrentUser);

export default router;
