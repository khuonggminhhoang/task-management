const taskRoutes = require('./task.route');

module.exports = (app) => {
    const routeVer1 = '/api/v1';

    app.use(routeVer1 + '/tasks', taskRoutes);
}