const taskRoutes = require('./task.route');
const authRoutes = require('./auth.route');

module.exports = (app) => {
    const routeVer1 = '/api/v1';

    app.use(routeVer1 + '/tasks', taskRoutes);

    app.use(routeVer1 + '/auth', authRoutes);
}