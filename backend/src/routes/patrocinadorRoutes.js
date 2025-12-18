import { Router } from 'express';
import {
  obterPatrocinadores,
  obterPatrocinadoresAtivos,
  obterPatrocinadorPorId,
  criarNovoPatrocinador,
  atualizarPatrocinadorExistente,
  removerPatrocinador,
} from '../controllers/patrocinadorController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = Router();

// Rota pública (sem autenticação) - deve vir ANTES do router.use(authRequired)
router.get('/public', obterPatrocinadoresAtivos);

// Rotas protegidas (com autenticação)
router.use(authRequired);

router.get('/', obterPatrocinadores);
router.get('/:id', obterPatrocinadorPorId);
router.post('/', criarNovoPatrocinador);
router.put('/:id', atualizarPatrocinadorExistente);
router.delete('/:id', removerPatrocinador);

export default router;

