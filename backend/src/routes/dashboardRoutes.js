import { Router } from 'express';
import { obterResumoDashboard } from '../controllers/dashboardController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authRequired);

router.get('/', obterResumoDashboard);

export default router;

