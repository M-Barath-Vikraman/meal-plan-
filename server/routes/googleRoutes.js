import { Router } from 'express';
import { connectGoogle, handleGoogleCallback } from '../controllers/googleController.js';

const router = Router();

/**
 * Google integrations routes placeholder.
 * Future Integration: Google Calendar & Tasks APIs.
 */
router.get('/connect', connectGoogle);
router.get('/callback', handleGoogleCallback);

export default router;
