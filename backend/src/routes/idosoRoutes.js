import { Router } from 'express';
import {
  obterIdosos,
  obterIdosoPorId,
  criarNovoIdoso,
  atualizarIdosoExistente,
  removerIdoso,
} from '../controllers/idosoController.js';
import { authRequired } from '../middlewares/authMiddleware.js';
import { validateIdoso } from '../middlewares/validationMiddleware.js';

const router = Router();

router.use(authRequired);

router.get('/', obterIdosos);
router.get('/:id', obterIdosoPorId);
router.post('/', validateIdoso, criarNovoIdoso);
router.put('/:id', validateIdoso, atualizarIdosoExistente);
router.delete('/:id', removerIdoso);

export default router;

