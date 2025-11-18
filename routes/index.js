import agenteRouter from './agenteRoutes.js';
import usuarioRouter from './usuarioRoutes.js';
import rolRouter from './rolRoutes.js';
import authRouter from './authRoutes.js';
import uploadRouter from './uploadRoutes.js';

const routerApi = (app) => {
    // Rutas de autenticación (públicas)
    app.use('/api/auth', authRouter);
    
    // Ruta de upload (protegida)
    app.use('/api/upload', uploadRouter);
    
    // Rutas protegidas (requieren autenticación)
    app.use('/api/agentes', agenteRouter);
    app.use('/api/usuarios', usuarioRouter);
    app.use('/api/roles', rolRouter);
    
    // Log para verificar que las rutas están registradas
    console.log('✅ Rutas registradas:');
    console.log('  - /api/auth');
    console.log('  - /api/upload');
    console.log('  - /api/agentes');
    console.log('  - /api/usuarios');
    console.log('  - /api/roles');
}

export default routerApi;

