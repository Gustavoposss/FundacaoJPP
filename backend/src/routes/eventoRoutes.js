import { Router } from 'express';
import {
  obterEventos,
  obterEventoPorId,
  criarNovoEvento,
  atualizarEventoExistente,
  removerEvento,
  listarEventosPublicosController,
  buscarEventoPublicoController,
  listarFotosEventoController,
  adicionarFotoEventoController,
  removerFotoEventoController,
} from '../controllers/eventoController.js';
import { authRequired } from '../middlewares/authMiddleware.js';
import { validateEvento } from '../middlewares/validationMiddleware.js';

const router = Router();

// Rotas públicas (sem autenticação) - devem vir ANTES do router.use(authRequired)
router.get('/public', listarEventosPublicosController);
router.get('/public/:id', buscarEventoPublicoController);

// Rotas protegidas (com autenticação)
router.use(authRequired);

router.get('/', obterEventos);
router.get('/:id', obterEventoPorId);
router.post('/', validateEvento, criarNovoEvento);
router.put('/:id', validateEvento, atualizarEventoExistente);
router.delete('/:id', removerEvento);

// Rotas para gerenciar fotos (protegidas)
router.get('/:id/fotos', listarFotosEventoController);
router.post('/:id/fotos', adicionarFotoEventoController);
router.delete('/:id/fotos/:fotoId', removerFotoEventoController);

export default router;

