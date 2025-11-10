import express from 'express';
import { gerarRelatorio, exportarRelatorio } from '../controllers/relatorioController.js';
import { authRequired } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas de relatórios requerem autenticação
router.get('/', authRequired, gerarRelatorio);
router.get('/export', authRequired, exportarRelatorio);

export default router;

