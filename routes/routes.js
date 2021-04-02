// import other routes
const userCpRoutes = require('./users_cp');
const userFrontRoutes = require('./users_front');
const testRoutes = require('./test');



const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    userCpRoutes(app, fs);
    userFrontRoutes(app, fs);


 

    // test
    testRoutes(app, fs);



};

module.exports = appRouter;