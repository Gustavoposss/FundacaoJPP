import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import idosoRoutes from './routes/idosoRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import presencaRoutes from './routes/presencaRoutes.js';
import documentoRoutes from './routes/documentoRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';
import storageRoutes from './routes/storageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import membroEquipeRoutes from './routes/membroEquipeRoutes.js';
import patrocinadorRoutes from './routes/patrocinadorRoutes.js';
import { notFoundHandler, errorHandler } from './utils/errorHandler.js';

dotenv.config();

const app = express();

// Configurar CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? false : true),
  credentials: true,
};

// Se não houver FRONTEND_URL em produção, permitir todas as origens (para desenvolvimento)
if (!process.env.FRONTEND_URL && process.env.NODE_ENV === 'production') {
  corsOptions.origin = true;
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.resolve('src/uploads');
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', authRoutes);
app.use('/api/idosos', idosoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/presencas', presencaRoutes);
app.use('/api/documentos', documentoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/membros-equipe', membroEquipeRoutes);
app.use('/api/patrocinadores', patrocinadorRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;