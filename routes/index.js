import agenteRouter from './agenteRoutes.js';
import usuarioRouter from './usuarioRoutes.js';
import rolRouter from './rolRoutes.js';

const routerApi = (app) => {
    app.use('/api/agentes', agenteRouter);
    app.use('/api/usuarios', usuarioRouter);
    app.use('/api/roles', rolRouter);
}

export default routerApi;

