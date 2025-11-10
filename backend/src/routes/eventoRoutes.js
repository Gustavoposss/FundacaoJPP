import { Router } from 'express';
import {
  obterEventos,
  obterEventoPorId,
  criarNovoEvento,
  atualizarEventoExistente,
  removerEvento,
} from '../controllers/eventoController.js';
import { authRequired } from '../middlewares/authMiddleware.js';
import { validateEvento } from '../middlewares/validationMiddleware.js';

const router = Router();

router.use(authRequired);

router.get('/', obterEventos);
router.get('/:id', obterEventoPorId);
router.post('/', validateEvento, criarNovoEvento);
router.put('/:id', validateEvento, atualizarEventoExistente);
router.delete('/:id', removerEvento);

export default router;

