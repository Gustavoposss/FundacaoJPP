import express from 'express';
import { getPerfilImages, getImageUrl } from '../controllers/storageController.js';

const router = express.Router();

// Rota para obter URLs das imagens de perfil
router.get('/perfis', getPerfilImages);

// Rota genérica para obter URL de qualquer imagem
router.get('/:bucket/:fileName', getImageUrl);

export default router;

