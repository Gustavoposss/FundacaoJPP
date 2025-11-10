import { Router } from 'express';
import { login, registrar } from '../controllers/authController.js';
import { validateLogin, validateRegistro } from '../middlewares/validationMiddleware.js';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/registrar', validateRegistro, registrar);

export default router;

