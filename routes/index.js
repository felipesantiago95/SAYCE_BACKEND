const ciudadesRouter = require('./ciudades.router');
const provinciasRouter = require('./provincias.router');
const paisesRouter = require('./paises.router');
const apoderadosRouter = require('./apoderados.router');
const auditoriasRouter = require('./auditorias.router');
const bancosRouter = require('./bancos.router');
const cuentas_bancariasRouter = require('./cuentas_bancarias.router');
const detalles_segurosRouter = require('./detalles_seguros.router');
const herederosRouter = require('./herederos.router');
const rolesRouter = require('./roles.router');
const segurosRouter = require('./seguros.router');
const usuario_rolesRouter = require('./usuario_roles.router');
const usuariosRouter = require('./usuarios.router');
const tipo_cuentasRouter = require('./tipo_cuentas.router');
const sociosRouter = require('./socios.router');
const obrasRouter = require('./obrasRouter');
const contratosRouter = require('./contratos.router');
const regaliasRouter = require('./regalias.router'); // Nueva ruta para regalias
const facturasRouter = require('./facturas.router');
//const { verificarToken } = require('./middlewares/auth');

function routerApi(app) {
  //app.use(verificarToken);
  app.use('/ciudades', ciudadesRouter);
  app.use('/provincias', provinciasRouter);
  app.use('/paises', paisesRouter);
  app.use('/apoderados', apoderadosRouter);
  app.use('/auditorias', auditoriasRouter);
  app.use('/bancos', bancosRouter);
  app.use('/cuentas_bancarias', cuentas_bancariasRouter);
  app.use('/detalles_seguros', detalles_segurosRouter);
  app.use('/herederos', herederosRouter);
  app.use('/roles', rolesRouter);
  app.use('/seguros', segurosRouter);
  app.use('/usuario_roles', usuario_rolesRouter);
  app.use('/usuarios', usuariosRouter);
  app.use('/tipo_cuentas', tipo_cuentasRouter);
  app.use('/socios', sociosRouter);
  app.use('/obras', obrasRouter);
  app.use('/contratos', contratosRouter);
  app.use('/regalias', regaliasRouter); // Integración de la nueva ruta
  app.use('/facturas', facturasRouter);
}

module.exports = routerApi;
