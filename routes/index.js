import agenteRouter from './agenteRoutes.js';
import usuarioRouter from './usuarioRoutes.js';
import rolRouter from './rolRoutes.js';
import authRouter from './authRoutes.js';

const routerApi = (app) => {
    // Rutas de autenticación (públicas)
    app.use('/api/auth', authRouter);
    
    // Rutas protegidas (requieren autenticación)
    app.use('/api/agentes', agenteRouter);
    app.use('/api/usuarios', usuarioRouter);
    app.use('/api/roles', rolRouter);
}

export default routerApi;

