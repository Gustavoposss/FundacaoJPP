import { Router } from 'express';
import {
  obterDocumentosPorIdoso,
  uploadDocumento,
  removerDocumento,
} from '../controllers/documentoController.js';
import { authRequired } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(authRequired);

router.get('/:idosoId', obterDocumentosPorIdoso);
router.post('/:idosoId', upload.single('arquivo'), uploadDocumento);
router.delete('/:id', removerDocumento);

export default router;

