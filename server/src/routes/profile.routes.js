import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { profileSchema } from '../validators/conversation.validator.js';
import { getProfileHandler, updateProfileHandler } from '../controllers/profile.controller.js';
import { verifySessionHandler } from '../controllers/auth.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getProfileHandler));
router.patch('/', validate(profileSchema, 'body'), asyncHandler(updateProfileHandler));
router.get('/session', asyncHandler(verifySessionHandler));

export default router;

