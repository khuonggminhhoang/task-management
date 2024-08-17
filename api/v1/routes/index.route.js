const taskRoutes = require('./task.route');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

module.exports = (app) => {
    const routeVer1 = '/api/v1';

    app.use(routeVer1 + '/tasks', taskRoutes);

    app.use(routeVer1 + '/auth', authRoutes);
    
    app.use(routeVer1 + '/user', userRoutes);

}