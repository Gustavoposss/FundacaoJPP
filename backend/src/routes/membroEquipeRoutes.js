import { Router } from 'express';
import {
  obterMembros,
  obterMembrosAtivos,
  obterMembroPorId,
  criarNovoMembro,
  atualizarMembroExistente,
  removerMembro,
} from '../controllers/membroEquipeController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota pública (sem autenticação) - deve vir ANTES do router.use(authRequired)
router.get('/public', obterMembrosAtivos);

// Rotas protegidas (com autenticação)
router.use(authRequired);

router.get('/', obterMembros);
router.get('/:id', obterMembroPorId);
router.post('/', criarNovoMembro);
router.put('/:id', atualizarMembroExistente);
router.delete('/:id', removerMembro);

export default router;

