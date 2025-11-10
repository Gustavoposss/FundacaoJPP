import { Router } from 'express';
import {
  obterPresencasPorEvento,
  obterIdososComPresenca,
  registrarPresencas,
} from '../controllers/presencaController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authRequired);

router.get('/:eventoId', obterPresencasPorEvento);
router.get('/:eventoId/idosos', obterIdososComPresenca);
router.post('/:eventoId', registrarPresencas);

export default router;

